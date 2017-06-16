import * as moment from 'moment/moment';

export class Pause {

    private timer;

    private isOnPause: boolean;
    private startTime: any;
    private endTime: any;

    constructor(){}

    // Getters and setters

    getIsOnPause(){
        return this.isOnPause;
    }

    setIsOnPause(isOnPause:boolean){
        this.isOnPause = isOnPause;
    }   

    getStartTime(){
        return this.startTime;
    }

    setStartTime(startTime:boolean){
        this.startTime = startTime;
    }

    getEndTime(){
        return this.endTime;
    }

    setEndTime(endTime:boolean){
        this.endTime = endTime;
    }

    // Others

    initPause(){
        this.isOnPause = false;
        this.startTime = null;
        this.endTime = null;
    }

    private rx;

    startPause(){
        this.initPause();
        this.isOnPause = true;
        this.startTime = moment().clone;
        // emit start of pause
    }

    endPause(){
        this.isOnPause = false;
        this.endTime = moment().clone;
        // emit end of pause
    }

    getPauseDuration(){
        return moment.duration(this.endTime.diff(this.startTime)).asMilliseconds();
    }



    // Ajout de la méthode observée
    // Quand une modif les autres services se mettent à jour

}