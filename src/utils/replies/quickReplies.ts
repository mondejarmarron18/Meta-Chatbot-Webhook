import { postWelcome } from "../webhook";
import webhookPayload from "../webhookPayload";

const quickReplies = (event: any, psid: string) => {
  if (event.message?.quick_reply) {
    switch (event.message.quick_reply?.payload) {
      case webhookPayload.goBack:
        return postWelcome(psid);
    }
  }
};

export default quickReplies;
