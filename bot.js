// this code was given to me by 1988_YumChocolate from the ROBLOX API Server, all credits (as far as I know) go to him


const roblox = require('noblox.js')
const Discord = require('discord.js')
const client = new Discord.Client();
var token = "NTgyMDM2MjY2MTM3MTU3NjMz.XOn9rg.xNZWBbjBVeZfDGgsnx1wl38Ep1Y";

client.login(token)

var cookie = "50CA3EAE9E94213BEE4E258CF5D59606F7CFAA2735C18659C569933EA1B38EB0703F475361193499139CDD4FA939D646C73BAEC34E5BC713471E89B9F3A64CB2FD9F2547BD0175EE1FCC2DE40341317A327256BC3E7C5CECF3A985599C0062D724852ECB2887E558909FEF8328485F118A6C00977173DF81CA9C870DBD7D6EA96C99A3D79C0FB8A1A15F6F662C9EC44223744E8DFB6EF70C1242291A13B57325065DAB02D4CE864507219854CE2452A6F7BF6AE9CA4C1CCED0998F53CA6FF9AD779CE934B665A6253C8845AC44018863F7CC38CE412D0460AA491FE1313AA042601222B31498D85E5562CAC39F3828084BEA039AA28C9EF8988E71D90EC725EFE2ACB4E5FAA12717AB09086BA52C2D24972D691907DDFAD2A0424D015940A345951D48B91C47042B050AC06749B5ED9B285DBB73";
var prefix = '.';
var groupId = 4702904;
var maximumRank = 10;

function login() {
    return roblox.cookieLogin(cookie);
}

login() // Log into ROBLOX
    .then(function() { // After the function has been executed
        console.log('Logged in.') // Log to the console that we've logged in
    })
    .catch(function(error) { // This is a catch in the case that there's an error. Not using this will result in an unhandled rejection error.
        console.log(`Login error: ${error}`) // Log the error to console if there is one.
    });
 
function isCommand(command, message){
    var command = command.toLowerCase();
    var content = message.content.toLowerCase();
    return content.startsWith(prefix + command);
}
 
client.on('message', (message) => {
    if (message.author.bot) return; // Dont answer yourself.
    var args = message.content.split(/[ ]+/)
   
    if(isCommand('rank', message)){
       if(!message.member.roles.some(r=>["Promotions"].includes(r.name)) ) // OPTIONAL - Checks if the sender has the specified roles to carry on further
        return message.reply("You can't use this command.");
        var username = args[1]
        var rankIdentifier = Number(args[2]) ? Number(args[2]) : args[2];
        if (!rankIdentifier) return message.channel.send("Please enter a rank");
        if (username){
            message.channel.send(`Checking ROBLOX for ${username}`)
            roblox.getIdFromUsername(username)
            .then(function(id){
                roblox.getRankInGroup(groupId, id)
                .then(function(rank){
                    if(maximumRank <= rank){
                        message.channel.send(`${id} is rank ${rank} and not promotable.`)
                    } else {
                        message.channel.send(`${id} is rank ${rank} and promotable.`)
                        roblox.setRank(groupId, id, rankIdentifier)
                        .then(function(newRole){
                            message.channel.send(`Changed rank to ${newRole.Name}`)
                        }).catch(function(err){
                            console.error(err)
                            message.channel.send("Failed to change rank.")
                        });
                    }
                }).catch(function(err){
                    message.channel.send("Couldn't get that player in the group.")
                });
            }).catch(function(err){
                message.channel.send(`Sorry, but ${username} doesn't exist on ROBLOX.`)
           });
       } else {
           message.channel.send("Please enter a username.")
       }
       return;
   }
})