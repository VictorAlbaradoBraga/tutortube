# TutorTube – Assistente Inteligente de Estudo baseado em Vídeos

## Descrição

O **TutorTube** é um sistema de aprendizado baseado em vídeos, onde o usuário pode escolher um tema e o aplicativo utiliza uma série de agentes inteligentes para organizar e explicar o conteúdo de forma interativa. O sistema busca vídeos do YouTube, transcreve automaticamente seu conteúdo, organiza a informação em tópicos de aprendizado e oferece uma interface de chat interativo para responder dúvidas.

### Funcionalidades principais:

* Busca vídeos no YouTube sobre o tema escolhido.
* Transcrição automática dos vídeos.
* Organização do conteúdo em tópicos e resumos.
* Geração de mapa mental e quizzes de aprendizagem.
* Respostas a dúvidas dos usuários usando um sistema de Multi-Agent.
* Armazenamento de dados e metadados no ChromaDB.

## Arquitetura Técnica

### Frontend (React + MUI)

* **Página Inicial**: Campo de pesquisa para digitar o tema de estudo.
* **Chat interativo**: Com integração com o RAG para responder dúvidas.
* **Playlist recomendada**: Lista de vídeos encontrados para o tema pesquisado.
* **Mapa mental**: Gerado automaticamente com os tópicos e resumos dos vídeos.
* **Quiz de aprendizagem**: Gerado automaticamente a partir do conteúdo do vídeo.

### Backend (FastAPI + ChromaDB + Multi-Agents)

* **Endpoint `/search-video`**: Busca vídeos no YouTube.
* **Endpoint `/ingest`**: Processa as transcrições dos vídeos e armazena no ChromaDB.
* **Endpoint `/rag-query`**: Permite que o usuário faça perguntas com base nos conteúdos armazenados.
* **Endpoint `/agents/run`**: Roda os agentes de pesquisa, curadoria e explicação.

### Tecnologias Sugeridas

* **Frontend**: React + MUI
* **Backend**: FastAPI
* **DB vetorial**: ChromaDB
* **API de Busca YouTube**: YouTube Data API v3
* **Multi-Agent**: CrewAI ou LangGraph
* **Deploy**: Railway / Vercel

---

## Fluxo do Sistema

1. **Agente Pesquisador**: Realiza a busca por vídeos no YouTube, coleta transcrições e gera metadados que são armazenados no **ChromaDB**.
2. **Agente Curador**: Limpa e organiza a transcrição, separa os tópicos de aprendizagem e gera resumos e mapas mentais.
3. **Agente Explicador**: Usa o **RAG** (Retrieve-and-Generate) para responder perguntas personalizadas dos usuários com base no conteúdo transcrito.
4. **Frontend**: O usuário pode interagir com o sistema através de uma interface limpa e intuitiva, com chat para dúvidas e uma lista de vídeos recomendados.

## Pipeline de Conhecimento no YouTube

1. O usuário insere o **link do vídeo do YouTube**.
2. O sistema baixa a **transcrição** do vídeo.
3. A transcrição é **limpa**, **dividida em chunks** e **embebida** no **ChromaDB**.
4. O conteúdo está pronto para ser usado no sistema de **Multi-Agents** para responder dúvidas dos usuários com base nos vídeos.

## Como Rodar o Projeto

### Pré-requisitos

* Python 3.8+
* Node.js 16+
* FastAPI, React, MUI e outras dependências do backend e frontend

### Backend

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu_usuario/tutortube.git
   cd tutortube/backend
   ```
2. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```
3. Crie e configure um arquivo `.env` com suas credenciais da **YouTube Data API**.
4. Rode o servidor:

   ```bash
   uvicorn main:app --reload
   ```

### Frontend

1. Navegue até a pasta do frontend:

   ```bash
   cd tutortube/frontend
   ```
2. Instale as dependências:

   ```bash
   npm install
   ```
3. Rode o servidor:

   ```bash
   npm run dev
   ```
---

**TutorTube** foi criado para ajudar os alunos a estudar de maneira interativa e dinâmica, transformando vídeos do YouTube em uma base de conhecimento útil, acessível e personalizada.
