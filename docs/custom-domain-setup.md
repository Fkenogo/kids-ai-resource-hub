# Custom Domain Setup Guide: Connecting kidsairesources.com to Firebase Hosting

This guide walks you through connecting your custom domain `www.kidsairesources.com` from GoDaddy to your Firebase Hosting site.

## Prerequisites

- ✅ Firebase project "kids-ai-resources" is set up
- ✅ Site is deployed to Firebase Hosting (URL: https://kids-ai-resources.web.app)
- ✅ You have access to GoDaddy account with `kidsairesources.com` domain
- ✅ You have admin access to Firebase Console

## Step 1: Add Custom Domain in Firebase Console

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com/
   - Select your project: "kids-ai-resources"

2. **Navigate to Hosting**
   - In the left sidebar, click on "Hosting" under the "Build" section

3. **Add Custom Domain**
   - Click the "Add custom domain" button
   - Enter: `kidsairesources.com`
   - Click "Continue"

4. **Get DNS Records**
   - Firebase will display the DNS records you need to configure
   - **IMPORTANT**: Copy these records exactly as shown
   - You'll typically see:
     - A records (pointing to Firebase IP addresses)
     - TXT record (for domain verification)

## Step 2: Configure DNS in GoDaddy

1. **Log into GoDaddy**
   - Go to https://dcc.godaddy.com/
   - Log into your account

2. **Select Your Domain**
   - Find `kidsairesources.com` in your domain list
   - Click on it to manage settings

3. **Access DNS Management**
   - Click on "DNS" or "Manage DNS"
   - This takes you to the DNS Zone File editor

4. **Add DNS Records**
   - **For each record provided by Firebase:**
   - Click "Add" or "Add Record"
   - Select the record type (A, TXT, etc.)
   - Enter the exact values from Firebase Console
   - Set TTL to default (usually 1 hour)

### Common DNS Records You'll Need to Add:

**A Records (IPv4 addresses):**

```
Type: A
Host: @ (or leave blank)
Points to: [Firebase IP address from console]
TTL: 1 hour
```

**TXT Record (Domain Verification):**

```
Type: TXT
Host: @
Value: [Verification string from Firebase]
TTL: 1 hour
```

**CNAME Record (for www subdomain):**

```
Type: CNAME
Host: www
Points to: [Firebase domain from console]
TTL: 1 hour
```

## Step 3: Verify Domain and Enable SSL

1. **Return to Firebase Console**
   - Go back to the Firebase Hosting domain setup page
   - Click "Verify" to check if DNS records are properly configured

2. **Wait for Propagation**
   - DNS changes can take 24-48 hours to propagate globally
   - Firebase will automatically detect when records are ready

3. **SSL Certificate**
   - Firebase automatically provisions an SSL certificate
   - This happens automatically once domain verification is complete
   - Status will show as "Provisioning" then "Active"

## Step 4: Test Your Custom Domain

Once Firebase shows your domain as "Active":

1. **Test the domain:**
   - Visit `https://kidsairesources.com`
   - Visit `https://www.kidsairesources.com`

2. **Verify SSL:**
   - Check that the site loads with HTTPS
   - Look for the padlock icon in your browser
   - Ensure no SSL warnings appear

3. **Test functionality:**
   - Navigate through your site
   - Verify all pages load correctly
   - Test any forms or interactive elements

## Troubleshooting

### Domain Not Verifying

- Double-check DNS records in GoDaddy
- Ensure no typos in IP addresses or verification strings
- Wait 24-48 hours for DNS propagation
- Use online DNS lookup tools to verify records

### SSL Certificate Issues

- Firebase automatically handles SSL for custom domains
- If SSL shows as "Provisioning" for more than 24 hours, check DNS
- Ensure you have both root domain and www records configured

### Site Not Loading

- Verify your site is deployed: `firebase deploy --only hosting`
- Check that the correct site ID is configured
- Ensure no firewall or security settings block access

## Next Steps

Once your custom domain is active:

1. **Update any hardcoded URLs** in your application to use your custom domain
2. **Set up Google Analytics** with your new domain
3. **Configure SEO settings** for better search engine visibility
4. **Monitor site performance** and user experience

## Commands Reference

```bash
# Deploy to Firebase Hosting
firebase deploy --only hosting

# List Firebase projects
firebase projects:list

# List hosting sites
firebase hosting:sites:list

# Build your project
npm run build
```

## Support

If you encounter issues:

- Check Firebase Hosting documentation: https://firebase.google.com/docs/hosting/custom-domain
- GoDaddy DNS support: https://www.godaddy.com/help
- Firebase Support: https://firebase.google.com/support
