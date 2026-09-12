# ✦ Lucas — Web Designer & Designer Gráfico em Portugal

> **Portfólio profissional de alta conversão, estética premium e performance sub-segundo.**

[![Website](https://img.shields.io/badge/Website-leportfolio.site-031927?style=for-the-badge&logo=googlechrome&logoColor=white)](https://www.leportfolio.site/)
[![Status](https://img.shields.io/badge/Status-Ativo%20%2F%20Produção-00c853?style=for-the-badge)](https://www.leportfolio.site/)
[![Tech](https://img.shields.io/badge/Stack-HTML5%20%7C%20Vanilla%20CSS%20%7C%20JS%20%7C%20GSAP-ba1200?style=for-the-badge)](https://www.leportfolio.site/)

---

## 📌 Sobre o Projeto

Este repositório contém o código-fonte do website e portfólio oficial de **Lucas**, especialista em **Web Design, Design Gráfico e Identidade Visual** com foco no mercado de **Portugal** (clínicas, imobiliárias, serviços e empresas).

O projeto foi construído com design exclusivo sob medida (*custom-crafted*), sem a sobrecarga de templates pesados ou construtores visuais de CMS lentos. O resultado é uma experiência fluida, visualmente marcante e com foco absoluto em autoridade e conversão.

🌐 **Acesse online:** [https://www.leportfolio.site/](https://www.leportfolio.site/)

---

## ✨ Destaques e Funcionalidades

- 💎 **Design System Exclusivo & Dark Mode:**
  - Paleta com contraste refinado: Deep Navy (`#031927`), Sapphire Blue e detalhes luminescentes.
  - Tipografia de prestígio: combinação de *Space Grotesk*, *Instrument Serif* e *Inter*.
  - Glassmorphism sutil, bordas brilhantes e acabamento visual de alto padrão.

- ⚡ **Performance Extrema & Otimização:**
  - Ficheiros CSS e JS minificados para produção (`style.min.css`, `script.min.js`).
  - Preload de imagens e fontes críticas.
  - Configurações de cache agressivo e compressão (Brotli/Gzip) via `.htaccess`.
  - Pontuação de topo em Core Web Vitals e PageSpeed.

- 🪄 **Animações e Interatividade:**
  - Animações de revelação suave com **GSAP** e **ScrollTrigger**.
  - Canvas interativo de partículas ambientes no fundo (*ambient-particles*).
  - Cursor personalizado inteligente com micro-efeito magnético.
  - Contadores de estatísticas dinâmicos nativos sem bibliotecas externas.
  - FAQ com efeito sanfona (accordion) interativo e suave.

- 🔍 **SEO Técnico & Schema.org Completo:**
  - Marcação JSON-LD rica com múltiplos schemas: `WebSite`, `Person`, `ProfessionalService` e `FAQPage`.
  - Tags Open Graph (Facebook/LinkedIn) e Twitter Cards com imagens otimizadas para compartilhamento social (`assets/og-cover.jpg`).
  - `sitemap.xml` dinâmico e `robots.txt` estruturado.
  - Página de erro `404.html` estilizada e integrada.

- 📲 **Conversão e Contacto Imediato:**
  - Redirecionamento direto para WhatsApp com mensagem parametrizada conforme o plano ou interesse do cliente.
  - Comparativo transparente de serviços e tabela de investimento (Starter, Standard e Premium).

---

## 📂 Estrutura de Arquivos

```text
site-le-portifolio/
├── .htaccess                 # Regras Apache/LiteSpeed: compressão, cache e SSL
├── vercel.json               # Configuração de deploy, clean URLs e cache para Vercel
├── 404.html                  # Página de erro 404 personalizada
├── index.html                # Página principal (estrutura semântica e SEO)
├── robots.txt                # Diretivas para motores de busca
├── sitemap.xml               # Mapa do site para indexação no Google
├── style.css                 # Folha de estilos principal (desenvolvimento)
├── style.min.css             # Folha de estilos minificada (produção)
├── script.js                 # Scripts, animações e interações (desenvolvimento)
├── script.min.js             # Scripts minificados (produção)
├── gsap.min.js               # Biblioteca GSAP para animações
├── ScrollTrigger.min.js      # Plugin GSAP ScrollTrigger
├── hero-lucas.jpg            # Foto de destaque do autor
├── logo.png                  # Logótipo da marca
├── *.jpg                     # Imagens de projetos do portfólio (Aura, Oral Prestige, Realtor, Voltz)
└── assets/
    ├── favicon.svg           # Favicon vetorial
    ├── noise.svg             # Textura sutil para o background
    ├── og-cover.jpg          # Imagem de pré-visualização para redes sociais (1200x630)
    └── gfx/                  # Ilustrações e mockups SVG dos serviços gráficos
        ├── gfx-identidade-1.svg
        ├── gfx-identidade-2.svg
        ├── gfx-mockup-1.svg
        ├── gfx-print-1.svg
        ├── gfx-social-1.svg
        └── gfx-social-2.svg
```

---

## 🛠️ Tecnologias Utilizadas

- **Estrutura:** HTML5 Semântico
- **Estilização:** CSS3 puro (Flexbox, Grid, Variáveis CSS, Glassmorphism)
- **Lógica e Interatividade:** JavaScript Vanilla (ES6+)
- **Animações:** GSAP 3 + ScrollTrigger + Canvas API
- **Servidor & Performance:** Apache `.htaccess`, WebP/JPG otimizados, SVG vetorial

---

## 🚀 Como Executar Localmente

Como o projeto é construído em código web estático puro, não é necessário nenhum processo complexo de compilação ou instalação de pacotes:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/iNSANEEXX/site-le-portifolio.git
   ```

2. **Navegue até o diretório:**
   ```bash
   cd site-le-portifolio
   ```

3. **Abra no navegador:**
   - Dê dois cliques no arquivo `index.html`, ou
   - Utilize uma extensão como o **Live Server** no VS Code para hot reload automático:
     - Clique com o botão direito no `index.html` > *Open with Live Server*.

---

## ⚡ Deploy no Vercel

O projeto já possui configuração nativa no [vercel.json](vercel.json):
1. Importe o repositório na [Vercel](https://vercel.com/new).
2. Framework Preset: **Other** (detetado automaticamente).
3. Root Directory: `./` (padrão).
4. Clique em **Deploy**. O Vercel aplicará automaticamente *clean URLs*, compressão Edge e cabeçalhos de segurança HTTP.

---

## 📬 Contacto & Redes

- **Website:** [leportfolio.site](https://www.leportfolio.site/)
- **Email:** [lucas@leportfolio.site](mailto:lucas@leportfolio.site)
- **GitHub:** [@iNSANEEXX](https://github.com/iNSANEEXX)
- **WhatsApp:** Direct via link no site

---

## 📄 Licença

Todos os direitos reservados a Lucas Gabriel Marta. Desenvolvido para exibição profissional.
