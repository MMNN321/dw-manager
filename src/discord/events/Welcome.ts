import { GuildMember, MessageEmbed, TextChannel, PartialGuildMember } from "discord.js";
import JsonLinker from "../loaders/JsonLinker";
import { ChannelInformation } from "./AdUpvote";
import { StringMap } from "../../Types";
import CoinSystem from "../../coinsystem/CoinSystem";
import { createRandomLightColor } from "../util/RandomColor";
import Bot from "../Bot";

export default function (
    linker: JsonLinker<StringMap<ChannelInformation>>,
    messageLinker: JsonLinker<WelcomeData>,
    bot: Bot,
    coinSystem: CoinSystem
) {
    const welcomeChannelArray: string[] = [];
    messageLinker.load();

    Object.keys(linker.value).forEach((key) => {
        if (typeof linker.value[key] !== "undefined") {
            const value = linker.value[key] as ChannelInformation;

            if (value.welcome) {
                welcomeChannelArray.push(key);
            }
        }
    });

    return (member: GuildMember | PartialGuildMember) => {
        const isAccount = coinSystem.isAccount(member.id);

        const welcomeChannels = welcomeChannelArray
            .map((channelId) => member.guild.channels.cache.get(channelId))
            .filter((value) => value !== null);

        if (welcomeChannels.length > 0) {
            const welcomeChannel = welcomeChannels[0] as TextChannel;
            let boxes: WelcomeBox[];

            if (isAccount) {
                // User joined before
                boxes = messageLinker.value.Rejoin.Boxes;
            } else {
                // User is here the first time
                boxes = messageLinker.value.Newcomer.Boxes;
            }

            const randomBox = boxes[Math.floor(Math.random() * boxes.length)];
            const randomBoxMessage = randomBox.message[Math.floor(Math.random() * randomBox.message.length)];

            const localVars = {
                username: member.user.username,
            };

            const embed = makeWelcomeEmbed(
                bot.util.sp.merge(randomBox.title, bot.util.sp.getGlobalVariables(), localVars),
                bot.util.sp.merge(randomBoxMessage, bot.util.sp.getGlobalVariables(), localVars)
            );

            welcomeChannel.send(`<@${member.id}>`).then((mMsg) => {
                mMsg.delete();
            });

            welcomeChannel.send(embed);
        }
    };
}

export function makeWelcomeEmbed(title: string, description: string) {
    const embed = new MessageEmbed();
    embed.setTitle(title).setDescription(description);
    const randomColor = "#" + createRandomLightColor();
    embed.setColor(randomColor);
    embed.addField("Information", "Wir empfehlen dir diese Informationen durchzulesen: <#611866257502896133>");
    return embed;
}

export interface WelcomeData {
    Rejoin: {
        Boxes: WelcomeBox[];
    };
    Newcomer: {
        Boxes: WelcomeBox[];
    };
}

export interface WelcomeBox {
    title: string;
    message: string[];
}