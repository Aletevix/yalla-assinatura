# Gerador de Assinatura Yalla

Projeto React criado a partir do HTML puro do gerador de assinatura.

## Rodar localmente

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Testar o build gerado

```bash
npm run serve:dist
```

## Publicar no GitHub Pages

1. Envie estes arquivos para um repositorio no GitHub.
2. No GitHub, abra `Settings > Pages`.
3. Em `Build and deployment`, selecione `GitHub Actions`.
4. Faca push na branch `main`.

O workflow em `.github/workflows/deploy.yml` vai instalar as dependencias, gerar o build e publicar a pasta `dist`.
