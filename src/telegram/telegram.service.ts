import { Injectable } from '@nestjs/common';
import TelegramBot from 'node-telegram-bot-api';
const TgBot = require('node-telegram-bot-api');

import axios from 'axios';
import { CarsList } from "./interfaces";
import { Cron, CronExpression } from '@nestjs/schedule';

const token = '';
const BaseUrl = 'https://savdo.uzavtosanoat.uz/b/ap/stream/ph&models';

@Injectable()
export class TelegramService {
    bot: TelegramBot;
    user_id: number;
    // usersArr:number[] = [153112599, 587757592]
    usersArr:number[] = [153112599, ]
    constructor() {
        this.bot = new TgBot(token, {polling: true});

        this.bot.on('message', async (msg)=>{
            this.user_id = msg.chat.id;
            this.usersArr.find(id=>id == msg.chat.id) ?
            this.usersArr.push(msg.chat.id)
            : '';
            const user_msg = msg.text;
            if(user_msg === '/cars') {
                const cars = await this.getCars();
                this.bot.sendMessage(this.user_id, cars);
            }else if(user_msg === '/check') {
                const check = await this.checkContract();
                this.bot.sendMessage(this.user_id, check);
            }else if(user_msg === '/price') {
                const price = await this.getCarsPrice();
                this.bot.sendMessage(this.user_id, price);
            }else{
                this.bot.sendMessage(this.user_id, 'command not found');
            }
        })
    }

    @Cron('0 */5 * * * *')
    // @Cron('45 * * * * *')
    async sentNotification() {
        const result = await this.checkContract();
        if(result !== 'Новых договоров нет') {
            this.bot.sendMessage(153112599, result);
        }
        // if(this.usersArr.length) {
        // const result = await this.checkContract();
        // this.usersArr.forEach(user=>{
        //     if(result !== 'Новых договоров нет') {
        //         this.bot.sendMessage(user, result);
        //     }
        // })
        // }
    }

    async getUzAutoCars() {
        const res:CarsList[] = await axios.post(BaseUrl, {
            "filial_id": 100,
            "is_web": "Y"
        }).then(x=>x.data)
        return res;
    }

    async getCarsPrice() {
        try {
            const cars = await this.getUzAutoCars();
            return cars.reduce((acc, item)=>{
                const text = `car:${item.name}`;
                const price = item.modifications.reduce((ac, el, ind)=>{
                    const p = ` ${el.price};`;
                    return ac+=p
                }, '')
    
                return acc+=text+'--'+price+';'
            },'')
        } catch (error) {
            return 'Ошибка с получением данных'
        }
    }

    async checkContract() {
        try {
            const cars = await this.getUzAutoCars();
            return cars.length === 7 ? 'Новых договоров нет' : "Договор открыть"
        } catch (error) {
            return 'Ошибка с получением данных'
        }
    }

    async getCars() {
        try {
            const cars = await this.getUzAutoCars();
            return cars.reduce((acc, item)=>{
                const text = `id: ${item.model_id} car:${item.name}`;
                return acc+=text+';'
            },'')
        } catch (error) {
            return 'Ошибка с получением данных'
        }
    }
}