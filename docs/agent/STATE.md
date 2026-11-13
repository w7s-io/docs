# W7S Docs Agent State

## Current State

- 2026-11-13: corrected the custom-domain DNS target to `w7s.cloud` across the guide, landing page, and blog content. This documentation correction does not change DNS or hostname provisioning.

- `/home/gnu/docs` is the public `w7s-io/docs` Docusaurus repository for `w7s.io/docs`.
- The docs now include a first-class Email Bindings page for W7S native backends.
- Email bindings are declared in `w7s.json` as `bindings.email` and uploaded by W7S core as Worker `send_email` bindings.
- Custom domain docs now cover `CNAME` path routes such as `omattic.com/compress-video`; W7S strips the mounted path prefix before dispatching to the app.
- The blog now includes comparison articles for Koyeb, Elestio, and W7S to support platform-alternative search traffic.

## Active Priorities

- Keep public docs aligned with W7S core manifest support.
- Update sidebar entries when adding new docs pages so generated `llms.txt`, sitemap, and Docusaurus navigation include them.
- Keep comparison content clear about category differences instead of presenting every platform as a direct clone.
