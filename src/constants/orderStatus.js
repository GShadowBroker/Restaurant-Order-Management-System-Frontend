const status = {
	PENDING: {
		name: "Pendente",
		color: "#e74c3c",
		text: "Marcar na fila",
		next: "IN_QUEUE",
	},
	IN_QUEUE: {
		name: "Na fila",
		color: "#e74c3c",
		text: "Marcar preparando",
		next: "PREPARING",
	},
	PREPARING: {
		name: "Em preparação",
		color: "#f39c12",
		text: "Marcar aguardando entrega",
		next: "AWAITING_DELIVERY",
	},
	AWAITING_DELIVERY: {
		name: "Aguardando entrega",
		color: "#f39c12",
		text: "Marcar entregue",
		next: "DELIVERED",
	},
	DELIVERED: {
		name: "Entregue",
		color: "#27ae60",
		text: "entregue",
		next: null,
	},
};

export default status;
