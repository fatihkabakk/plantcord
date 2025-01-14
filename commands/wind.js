const {MessageEmbed} = require("discord.js");
const config = require('../config.json');
const localization = require('../localization/'+config.localization_file);

module.exports.info = {
  "title" : localization.commands.wind.title.replace("<plant_name>", config.plant_name),
  "name" : localization.commands.wind.name,
  "desc" : localization.commands.wind.desc.replace("<plant_name>", config.plant_name),
  "color" : localization.commands.wind.color,
  "field" : localization.commands.wind.field.replace("<fan_duration>", config.wind_fan_duration),
  "moisture_low" : localization.commands.wind.moisture_low,
  "moisture_high" : localization.commands.wind.moisture_high,
  "recommended_moisture" : localization.commands.wind.recommended_moisture,
  "fan_already_on" : localization.commands.wind.fan_already_on,
  "fan_already_on_field" : localization.commands.wind.fan_already_on_field
}

module.exports.execute = (client, message) => {
  const embed = new MessageEmbed()
    .setTitle(this.info.title)
    .setColor(this.info.color)
    .setFooter({
      text: message.member.displayName,
      iconURL: message.author.displayAvatarURL({ dynamic: true }),
    })
    .setTimestamp();

  if(client.helpers.arduinoBridge.getFanState() == 0){
    setTimeout(fanTimeOut, config.wind_fan_duration * 1000, client, message);
    client.helpers.arduinoBridge.turnOnTheFan();
    if(client.helpers.arduinoBridge.getMoisture() < config.moisture_min){
      embed.addField(this.info.field, this.info.moisture_low + " " + config.emoji_sad + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
    }else if(client.helpers.arduinoBridge.getMoisture() > config.moisture_max){
      embed.addField(this.info.field, this.info.moisture_high + " " + config.emoji_happy + " " + this.info.recommended_moisture + ": %" + config.moisture_min + " - %" + config.moisture_max)
    }else{
      embed.addField(this.info.field, config.emoji_happy)
    }
  }else{
    embed.addField(this.info.fan_already_on, this.info.fan_already_on_field)
  }

  message.channel.send({ embeds: [embed] });
}

function fanTimeOut(client, message) {
  const embed = new MessageEmbed()
    .setTitle(localization.commands.wind.wind_stopped)
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
  client.helpers.arduinoBridge.turnOffTheFan();
}



