import { Router } from "express";
import ticketController, { TTicket } from "../controllers/ticketController";
import { postTicket } from "../utils/webhook";

const ticketRouter = Router();

ticketRouter.post("/", async (req, res) => {
  try {
    const ticket = await ticketController.createTicket(req.body);

    res.send(ticket);
  } catch (error) {
    res.send(error);
  }
});

ticketRouter.post("/:psid", async (req, res) => {
  try {
    const psid = req.params.psid;
    const body = req.body;

    await postTicket(psid, body);

    res.sendStatus(200);
  } catch (error) {
    res.send(error);
  }
});

ticketRouter.put("/", async (req, res) => {
  const ticket = await ticketController.updateTicket(req.body);

  res.send(ticket);
});

ticketRouter.get("/", async (req, res) => {
  try {
    const tickets = await ticketController.getTickets();

    res.send(tickets);
  } catch (error) {
    res.send(error);
  }
});

ticketRouter.get("/:ticketID", async (req, res) => {
  const ticketID = req.params.ticketID;

  if (/^[0-9]+$/.test(ticketID)) {
    const ticket = await ticketController.getTicket(+ticketID);

    return res.send(ticket);
  }

  res.status(400).send({
    ticketID: "Must be number",
  });
});

ticketRouter.delete("/", async (req, res) => {
  const tickets = await ticketController.deleteTickets();

  res.send(tickets);
});

ticketRouter.delete("/:ticketID", async (req, res) => {
  const ticketID = req.params.ticketID;

  if (/^[0-9]+$/.test(ticketID)) {
    const ticket = await ticketController.deleteTicket(+ticketID);

    return res.send(ticket);
  }

  res.status(400).send({
    ticketID: "Must be number",
  });
});

export default ticketRouter;
