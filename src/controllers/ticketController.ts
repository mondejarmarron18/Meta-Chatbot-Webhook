import { PrismaClient } from "@prisma/client";

type TTicket = {
  id: number;
  clientName: string;
  clientEmail: string;
  projectName: string;
  projectStatus: string;
  issuesAndConcerns: string;
};

const prisma = new PrismaClient();

const ticketController = {
  createTicket: async (ticket: Omit<TTicket, "id">) => {
    return await prisma.ticket.create({
      data: ticket,
    });
  },

  updateTicket: async (ticket: TTicket) => {
    try {
      const data = await prisma.ticket.update({
        where: {
          id: ticket.id,
        },
        data: ticket,
      });

      return data;
    } catch (error) {
      return error;
    }
  },

  getTickets: async () => {
    return await prisma.ticket.findMany();
  },

  getTicket: async (ticketID: TTicket["id"]) => {
    try {
      const data = await prisma.ticket.findUnique({
        where: {
          id: ticketID,
        },
      });

      return data;
    } catch (error) {
      return error;
    }
  },

  deleteTickets: async () => {
    try {
      const data = await prisma.ticket.deleteMany();

      return data;
    } catch (error) {
      return error;
    }
  },

  deleteTicket: async (ticketID: TTicket["id"]) => {
    try {
      const data = await prisma.ticket.delete({
        where: {
          id: ticketID,
        },
      });

      return data;
    } catch (error) {
      return error;
    }
  },
};

export default ticketController;
