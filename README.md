<p align="center">
  <img src="https://avatars.githubusercontent.com/u/165726427?s=200&v=4" alt="elwood">
  <br/>
  <small>
    <a href="mailto:mailto:hello@elwood.software">Email Us</a> &#8226;
    <a href="https://discord.gg/mkhKk5db">Discord</a>
  </small>
</p>

# What is Elwood

**Elwood** is an open source Dropbox alternative.

- [x] Lighting fast, resumable uploads
- [x] Real-time, multi-user collaboration
- [x] Simple user management
- [x] File previews for images, videos, and documents (text, markdown, code)
- [ ] Public link sharing
- [ ] Role-based access control (RBAC)
- [ ] Unified search with external providers (S3, Dropbox, Box, Google Drive, etc)
- [ ] AI chat based file manager assistant
- [ ] Zero knowledge, end-to-end encrypted file storage
- [ ] Desktop app
- [ ] Mobile app

<p>Elwood is currently in public <strong>BETA</strong>. We are actively developing and improving the code & documentation. If you have any questions, please reach out to us at <a href="mailto:hello@elwood.software">hello@elwood.software</a>.</p>

## 📦 Demo

You can try out the latest version of Elwood at [demo.elwood.software](https://demo.elwood.software), with these credentials:

- `demo@elwood.software`:`demo`

## 🚀 Development

To develop locally, you will need to have the following installed:

- [Docker](https://docs.docker.com/get-docker/)
- [pnpm](https://pnpm.io/installation)
- [Node.js](https://nodejs.org/en/download/)
- [Deno](https://deno.land/#installation)
- [Supabase CLI](https://supabase.io/docs/guides/cli)

To get started, run the following commands:

1. `git clone https://github.com/elwood-software/elwood.git`
2. `supabase up`
3. `./scripts/seed-storage.ts`
4. `pnpm install`
5. `pnpm dev`
6. open [http://localhost:3002](http://localhost:3002)
7. login with:
   - `admin@elwood.local`:`admin`
   - `member@elwood.local`:`member`
   - `no_member@elwood.local`:`no_member`

## :raised_hand: Support

- [Community Forum](https://github.com/orgs/elwood-software/discussions): Good for developer discussion, help debugging, ask questions. **Not sure, start here**
- [Discord](https://discord.gg/mkhKk5db): Join our Discord Server
- [GitHub Issues](https://github.com/elwood-software/elwood/issues): Good for bugs and errors in running Elwood locally
- [Email Support](mailto:support@elwood.software): Good for saying hi

## 🏛️ License

Distributed under the Apache-2.0 license. See [LICENSE](LICENSE) for more information.

## 📧 Contact

Elwood - [support@elwood.software](mailto:support@elwood.software)
