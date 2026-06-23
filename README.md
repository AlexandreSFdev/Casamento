## Casamento — site e sistema de depoimentos multimídia

Este repositório contém um site estático para um casamento com suporte a depoimentos multimídia (áudio, vídeo e imagens). O projeto funciona como SPA simples (hash routing) e oferece duas formas de persistência para mídias:

- Persistência centralizada (recomendado): upload para um servidor Express local/hosted (`/api/upload`) que salva o arquivo em `server/uploads` e devolve uma URL pública.
- Persistência local (fallback): gravação em IndexedDB quando o servidor não estiver disponível.

Principais funcionalidades
- Navegação SPA com páginas em `pages/` (carregadas dinamicamente em `#app`).
- Depoimentos com gravação via MediaRecorder, envio de arquivo e pré-visualização antes de confirmar.
- Gravações com limite de 3 minutos.
- Badges visuais e exibição da duração do áudio/vídeo.
- Navegação responsiva com menu "hamburger" para dispositivos móveis.
- Scaffold de servidor Express para aceitar uploads (`server/`).

Arquivos importantes
- `index.html` — shell do site e nav responsiva.
- `styles.css` — estilos e responsividade.
- `script.js` — lógica do SPA, gravação, preview, upload e IndexedDB fallback.
- `pages/` — conteúdo das páginas (ex.: `depoimentos.html`).
- `server/` — scaffold do servidor Express para uploads (não obrigatório).
- `tools/import_media_to_repo.js` — helper Node para copiar mídias locais para `media/` e commitar.

Como rodar localmente (desenvolvimento)
1. Servir os arquivos estáticos (opção simples):
```bash
# a partir da raiz do repositório
npx http-server -c-1 .
# abra http://localhost:8080
```
2. (Opcional, recomendado para centralizar mídias) Inicie o servidor de upload:
```bash
cd server
npm install
npm start
# servidor disponível em http://localhost:3000
```
3. No site, abra **Depoimentos** → grave ou envie um arquivo → visualize → clique em **Confirmar mídia** → o cliente tentará enviar para `/api/upload`. Se o servidor não responder, o arquivo será salvo localmente no IndexedDB como fallback.

Endpoint de upload (scaffold)
- `POST /api/upload` — aceita `multipart/form-data` com campo `media`. Retorna JSON: `{ id, url, originalName, mimeType }`.
- Arquivos são servidos via `GET /uploads/<filename>`.

Fluxo de mídia
1. Usuário grava/seleciona o arquivo.
2. O arquivo aparece em pré-visualização; o usuário pode reproduzir antes de confirmar.
3. Ao confirmar, o front-end tenta enviar para `/api/upload`.
	 - Sucesso: o depoimento salva a `mediaUrl` retornada pelo servidor — visível para todos.
	 - Falha: o arquivo é salvo no IndexedDB (local), e o depoimento referencia `mediaId` (funciona apenas no mesmo dispositivo/navegador).

Backup / arquivamento
- Para mover mídias do seu computador para o repositório (por exemplo, para backup), use `tools/import_media_to_repo.js`:
```bash
# copia arquivos de uma pasta local para ./media, commita e faz push
node tools/import_media_to_repo.js C:\caminho\para\pasta_de_midias
```

Segurança e recomendações
- Se for expor o endpoint `/api/upload` na sua casa, configure HTTPS (reverse proxy como NGINX), limites de tamanho e autenticação (token/API key).
- Adicione validação de tipos e verificação de tamanho no servidor (ex.: limitar a 100 MB por arquivo).
- Para evitar uploads anônimos, implemente um token simples ou OAuth em frente-end + servidor.
- Considere armazenar mídias em um serviço de objetos (S3 / Cloud Storage) se o volume crescer.

Deploy e opções serverless
- Self-host (recommended for your home server): execute o `server/index.js` e abra portas no roteador com segurança.
- Serverless / cloud alternatives:
	- Firebase Storage + Cloud Functions — fácil autenticação com Firebase Auth.
	- S3 + Lambda (presigned URLs) — escalável e baixo custo para armazenamento.
	- Netlify Functions / Vercel Serverless — simples para projetos estáticos com pequenas cargas.

Notas finais
- Branch protection e convites de colaboradores: veja `INSTRUCTIONS.md` para passos manuais e comandos `gh` já preparados.
- Se quiser, eu posso: adicionar autenticação no endpoint, barra de progresso de upload, limites de tamanho no cliente, ou automatizar o backup das mídias para um bucket S3.

---
Date: 2026-06-23

Release
- A tag `v1.1.0` foi criada e está no repositório remoto. Para publicar uma release com notas completas você pode:
	- Criar via GitHub UI: vá em *Releases* → *Draft a new release* → escolha `v1.1.0` e cole as notas.
	- Ou, localmente com GitHub CLI (se instalado):
```bash
gh release create v1.1.0 --title "v1.1.0 — Media & UX improvements" --notes "Veja o README para o changelog." 
```

Token de upload (UI)
- Adicionei um botão "Configurar token de upload" no rodapé do site — clique para salvar um token localmente (usado no header `Authorization: Bearer <token>`). Este token é armazenado no `localStorage` do navegador e não é enviado para o repositório.

Observação final: todos os arquivos e documentação foram commitados e enviados ao remoto. Se desejar, eu posso também criar a release via API caso você me forneça um token temporário com escopo `repo` (opcional).

