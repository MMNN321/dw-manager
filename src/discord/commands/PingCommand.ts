import { Message } from "discord.js";
import { BotAction } from "../Types";
import Command, { ReturnValue } from "../abstract/Command";

export default class PingCommand extends Command {
    run(action: BotAction, message: Message, args: string[]): ReturnValue {
        message.channel.send({
            embed: {
                description: this.bot.client.ws.ping,
                title: "Ping"
            }
        });
        return ReturnValue.SUCCESS;
    }
}
