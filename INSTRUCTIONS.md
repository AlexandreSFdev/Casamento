# Instruções — Repositório "Casamento"

Este documento reúne passos para gerenciar o repositório local e remoto, aplicar proteção ao branch `main` e operações úteis com o GitHub CLI (`gh`).

## Visão geral
- Repositório remoto criado: https://github.com/AlexandreSFdev/Casamento
- Branch principal: `main`
- Repositório atualmente: **privado**

---

## Comandos Git locais (já executados)
```powershell
# Inicializar (se necessário)
git init
# Adicionar todos os arquivos e commitar
git add .
git commit -m "Initial commit"
# Adicionar remote (exemplo SSH)
git remote add origin git@github.com:SEU_USUARIO/Casamento.git
# Ou se usar HTTPS (exemplo):
# git remote add origin https://github.com/SEU_USUARIO/Casamento.git
# Enviar branch main
git branch -M main
git push -u origin main
```

---

## Como ativar proteção do branch `main` via interface web (recomendado para usuários sem plano pago)
1. Abra o repositório: https://github.com/AlexandreSFdev/Casamento
2. Clique em **Settings** no topo do repositório.
3. No menu à esquerda, clique em **Branches**.
4. Em **Branch protection rules**, clique em **Add rule**.
5. Em **Branch name pattern** digite: `main`
6. Marque as opções desejadas (opções recomendadas):
   - **Require pull request reviews before merging** — marque e defina **Require approving review count** para `1`.
   - **Require status checks to pass before merging** — marque somente se você tiver CI configurado (caso contrário deixe desmarcado).
   - **Prevent force pushes** — marque para impedir force-pushes.
   - **Include administrators** — marque se quiser que as regras se apliquem também a administradores.
7. Clique em **Create** / **Save changes**.

> Observação: em alguns planos/contas o GitHub pode exibir um aviso e impedir criar regras para repositórios privados. Nesse caso veja a seção "Se houver restrição de plano".

---

## Se houver restrição de plano (proteção via UI/API bloqueada)
Opções:
- Manter o repositório privado e não aplicar a proteção por agora; você pode ativá-la manualmente se/ quando atualizar o plano.
- Tornar o repositório público temporariamente e então criar a regra; depois pode voltar a privacidade (eu posso ajudar se autorizar).

Se quiser tentar via CLI quando tiver permissão (ou se tornar público), exemplo com `gh` (PowerShell):
```powershell
# Tornar público (opcional):
& 'C:\Program Files\GitHub CLI\gh.exe' repo edit AlexandreSFdev/Casamento --public

# Aplicar proteção ao branch main via API (exemplo):
& 'C:\Program Files\GitHub CLI\gh.exe' api \
  -X PUT /repos/AlexandreSFdev/Casamento/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f required_status_checks=null \
  -f enforce_admins=true \
  -f required_pull_request_reviews='{"required_approving_review_count":1}' \
  -f restrictions=null

# Tornar privado novamente (opcional):
& 'C:\Program Files\GitHub CLI\gh.exe' repo edit AlexandreSFdev/Casamento --private
```
Notas:
- A API e algumas opções de proteção podem requerer um plano pago para repositórios privados; se ocorrer erro com a API, use a UI conforme a seção acima.

---

## Convidar colaboradores (via web)
1. Abra o repositório e vá em **Settings** > **Manage access**.
2. Clique em **Invite a collaborator** e digite o nome de usuário ou e-mail.
3. Escolha a permissão (Read / Write / Admin) e confirme o convite.

Opcional via `gh` (exemplo):
```powershell
# Substitua USERNAME pelo usuário a convidar
& 'C:\Program Files\GitHub CLI\gh.exe' api -X PUT /repos/AlexandreSFdev/Casamento/collaborators/USERNAME -f permission=push
```

---

## Como verificar se a proteção está ativa
- Na UI: **Settings** > **Branches** > ver a regra para `main` listada.
- Via `gh api`:
```powershell
& 'C:\Program Files\GitHub CLI\gh.exe' api /repos/AlexandreSFdev/Casamento/branches/main/protection
```

---

## Boas práticas para um site pessoal (sugestões)
- Mantenha o `README.md` com informações básicas (link do site, como contribuir, contato).
- Adicione um arquivo `CNAME` se for usar domínio personalizado.
- Considere configurar GitHub Pages (Settings > Pages) se quiser hospedar o site diretamente pelo GitHub.

---

## Links úteis
- Repositório: https://github.com/AlexandreSFdev/Casamento
- Documentação de proteção de branch (GitHub): https://docs.github.com/en/repositories/configuring-branches-and-merges/about-protected-branches
- GitHub CLI: https://cli.github.com/

---

Se quiser, eu também posso:
- Tornar o repositório público temporariamente e aplicar a proteção automaticamente;
- Gerar templates (`ISSUE_TEMPLATE`, `PULL_REQUEST_TEMPLATE`);
- Configurar GitHub Pages para publicar o site.

Diga qual próximo passo prefere.
