import {
  addDoc,
  collection,
  type DocumentData,
  deleteDoc,
  doc,
  type DocumentSnapshot,
  getCountFromServer,
  getDoc,
  getDocs,
  limit as withLimit,
  orderBy as withOrderBy,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
  type QueryConstraint,
  type QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';

export type FilterOp = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in' | 'not-in' | 'array-contains-any';
export type FirestoreFilter = { field: string; op: FilterOp; value: unknown };

const normalizeValue = (value: unknown): unknown => {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  if (value && typeof value === 'object') {
    const output: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      output[k] = normalizeValue(v);
    }
    return output;
  }
  return value;
};

const normalizeDoc = (snap: QueryDocumentSnapshot<DocumentData> | DocumentSnapshot<DocumentData>) => {
  const raw = snap.data() || {};
  return {
    id: raw.id || snap.id,
    ...normalizeValue(raw),
  };
};

export const readMany = async (
  collectionName: string,
  options?: {
    filters?: FirestoreFilter[];
    orderBy?: { field: string; direction?: 'asc' | 'desc' };
    limit?: number;
  },
) => {
  const constraints: QueryConstraint[] = [];
  for (const f of options?.filters || []) {
    constraints.push(where(f.field, f.op, f.value));
  }
  if (options?.orderBy) {
    constraints.push(withOrderBy(options.orderBy.field, options.orderBy.direction || 'asc'));
  }
  if (options?.limit) {
    constraints.push(withLimit(options.limit));
  }

  const q = constraints.length ? query(collection(db, collectionName), ...constraints) : query(collection(db, collectionName));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(normalizeDoc);
};

export const readOneById = async (collectionName: string, id: string) => {
  const snapshot = await getDoc(doc(db, collectionName, id));
  if (!snapshot.exists()) return null;
  return normalizeDoc(snapshot);
};

export const countMany = async (collectionName: string, filters?: FirestoreFilter[]) => {
  const constraints: QueryConstraint[] = [];
  for (const f of filters || []) {
    constraints.push(where(f.field, f.op, f.value));
  }
  const q = constraints.length ? query(collection(db, collectionName), ...constraints) : query(collection(db, collectionName));
  const result = await getCountFromServer(q);
  return result.data().count;
};

export const createOne = async (collectionName: string, data: Record<string, unknown>, id?: string) => {
  if (id) {
    await setDoc(doc(db, collectionName, id), data, { merge: true });
    return { id, ...data };
  }
  const ref = await addDoc(collection(db, collectionName), data);
  return { id: ref.id, ...data };
};

/** Creates a document only when the deterministic ID is unused; never merges or overwrites. */
export const createIfAbsent = async (collectionName: string, id: string, data: Record<string, unknown>) => {
  const reference = doc(db, collectionName, id);
  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(reference);
    if (snapshot.exists()) return false;
    transaction.set(reference, data);
    return true;
  });
};

export const updateOne = async (collectionName: string, id: string, data: Record<string, unknown>) => {
  await updateDoc(doc(db, collectionName, id), data);
};

export const upsertOne = async (collectionName: string, id: string, data: Record<string, unknown>) => {
  await setDoc(doc(db, collectionName, id), data, { merge: true });
};

/** Replaces the document wholesale: fields absent from `data` are removed. */
export const replaceOne = async (collectionName: string, id: string, data: Record<string, unknown>) => {
  await setDoc(doc(db, collectionName, id), data);
};

export const removeOne = async (collectionName: string, id: string) => {
  await deleteDoc(doc(db, collectionName, id));
};
