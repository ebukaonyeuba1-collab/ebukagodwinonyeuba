# Editing your portfolio without code

Your site now reads its content from four files in `content/`. You edit them from `/admin` on your live site.

## One-time setup (5 minutes)
1. Unzip this folder over your GitHub repo (ebukaonyeuba1-collab/ebukaonyeuba) and push to `main`. Vercel redeploys.
2. On GitHub: Settings > Developer settings > Personal access tokens > Fine-grained tokens > Generate new token.
   - Repository access: Only select repositories > ebukaonyeuba
   - Permissions: Repository permissions > Contents > Read and write
   - Pick an expiry date, generate, and copy the token.
3. Open https://ebukaonyeuba.vercel.app/admin, choose the sign-in-with-token option and paste the token.

## Every day
- Case studies: add a case study, give it a link name (lowercase, no spaces), then add blocks: Heading, Paragraph, Bullet points, Screenshots, Single image, Scores, Testimonial, Tags. Start each section with a Heading.
- Experience: add an entry inside a group (Professional Experience, Speaking, Student Leadership) or add a new group.
- Awards: add a category first, then add the award and pick the category. If you rename a category, re-pick it on its awards.
- Home page numbers: edit the strip. Type {awards} to show your live award count.
- Text boxes accept **bold**, *italic* and [link text](https://example.com).
- Save publishes a commit to GitHub. Vercel redeploys in about a minute.

## Not editable here
About page, contact page, home page headline and the menu are still in the HTML files.

## Keep safe
The token lives in your browser. Only sign in on your own devices, and revoke the token on GitHub if you lose a device.
