# Frontend para cadastro e notificação de pedidos de restaurante

Frontend básico e simples do sistema de gestão de pedidos em um restaurante fictício.

A página pode ser acessada no link:
https://orgulhodoleao.netlify.app/

## Tecnologias

- ReactJS
- SockJS e STOMP para comunicação via WebSockets com o servidor
- Material UI
- React Router

## Instalação

Para instalar, basta clonar o repositório

```bash
git clone https://github.com/GShadowBroker/Restaurant-Order-Management-System-Frontend.git
```

Acessar a pasta e instalar dependências

```bash
cd Restaurant-Order-Management-System-Frontend && npm install
```

Iniciar servidor de desenvolvimento

```bash
npm start
```

## Recursos

O front-end oferece quatro páginas:

- Home ["/"]: Permite adicionar pratos à lista de pedido, pesquisar pratos por nome, ou por código.
- Checkout ["/checkout/{{customer_id}}"]: Permite remover pratos da lista de pedido, confirmar pedido e acompanhar status dos pedidos.
- Cozinha["/cozinha"]: Exibe para a cozinha os pedidos e status. Permite à cozinha atualizar o status do pedido, bem como excluir pedidos concluídos.
- Garçom["/garcom"]: Permite marcar pedidos como entregues.

O status dos pedidos é atualizado em tempo real via websockets.

## License

[MIT](https://choosealicense.com/licenses/mit/)
