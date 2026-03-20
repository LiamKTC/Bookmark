# Project Bookmark Dashboard

A static bookmark dashboard designed for project-heavy work across multiple SharePoint and document environments.

## Files

- `index.html` — page structure
- `assets/css/styles.css` — styling
- `assets/js/app.js` — app logic and event wiring
- `assets/js/storage.js` — local storage and import/export helpers
- `assets/js/ui.js` — rendering helpers
- `data/sample-data.json` — example import file

## Publish to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files and folders from this project.
3. In GitHub, go to **Settings > Pages**.
4. Set the source to deploy from the main branch and root folder.
5. Save. GitHub will publish the site.

## Notes

- Data is stored in local browser storage.
- Export regularly if the dashboard becomes important to your workflow.
- Do not publish sensitive client names or confidential URLs on a public GitHub Pages site.

## Editing

- Click **Add project** to create a project section.
- Click **Add link** to add a bookmark.
- Double-click any bookmark card to edit it.
- Use **Export JSON** and **Import JSON** to back up or move your data.
