# PM2S

## Netlify Deployment

This project is deployed to Netlify. Deployments are triggered automatically whenever commits are pushed to the `main` branch on GitHub.

### Build settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Environment variables:** Set `NODE_VERSION=18` in the Netlify site settings to match the project's Node.js requirement. Add any `VITE_` prefixed variables needed by the app in the same section.

## Environment Variables

- `VITE_API_BASE_URL` – Base URL for API requests. Defaults to `/`.

### Viewing build logs
1. Log in to [Netlify](https://app.netlify.com) and open the site dashboard.
2. Navigate to **Deploys**.
3. Select the deploy associated with the commit you want to inspect.
4. Click **Logs** to view the full build output and troubleshoot any failures.

