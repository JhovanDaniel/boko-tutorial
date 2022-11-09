import EventEmitter from "events";
import Experience from "./Experience.js";
import GSAP from "gsap";
import convert from "./Utils/convertDivsToSpans.js"


export default class Preloader extends EventEmitter{
    constructor(){
        super();
 
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.world = this.experience.world;
        this.device = this.sizes.device;

        this.sizes.on("switchdevice", (device)=>{
            this.device = device;
        })

        this.world.on("worldready", ()=>{
            this.setAssets();
            this.playIntro();
        })
    }

    setAssets(){
        convert(document.querySelector(".intro-text"));
        convert(document.querySelector(".hero-main-title"));
        convert(document.querySelector(".hero-main-description"));
        convert(document.querySelector(".hero-second-subheading"));
        convert(document.querySelector(".second-sub"));
        this.room = this.experience.world.room.actualRoom;
        this.roomChildren = this.experience.world.room.roomChildren;
    }

    firstIntro(){
        return new Promise ((resolve)=>{
            this.timeline = new GSAP.timeline();
            this.timeline.set(".animatedis",{ y: 0, yPercent: 100});
            this.timeline.to(".preloader", {
                opacity: 0,
                delay: 1,
                onComplete: ()=>
                            document.querySelector(".preloader").classList.add("hidden"),
            }).to(this.room.position, {
                x: -1,
                ease: "power1.out",
                duration: 0.7,
            })

            if(this.device === "desktop"){
                this.timeline.to(this.roomChildren.cube.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                }).to(this.room.position, {
                    x: -1,
                    ease: "power1.out",
                    duration: 0.7,
                });
            }else{
                this.timeline.to(this.roomChildren.cube.scale, {
                    x: 1.4,
                    y: 1.4,
                    z: 1.4,
                    ease: "back.out(2.5)",
                    duration: 0.7,
                }).to(this.room.position, {
                    z: -1,
                    ease: "power1.out",
                    duration: 0.7,
                });
            }
            this.timeline.to( ".intro-text .animatedis", {
                yPercent: 0,
                stagger: 0.05,
                ease: "back.in(1.7)",
            }).to( ".arrow-svg-wrapper", {
                opacity: 1,
            }, "same").to( ".toggle-bar", {
                opacity: 1,
                onComplete: resolve,
            }, "same");
        })
        
    }

    secondIntro(){
        return new Promise ((resolve)=>{
            this.secondTimeline = new GSAP.timeline();

            this.secondTimeline.to( ".intro-text .animatedis", {
                yPercent: 100,
                stagger: 0.05,
                ease: "back.in(1.7)",
            }, "endarrow").to( ".arrow-svg-wrapper", {
                opacity: 0,
            }, "endarrow").to(this.room.position, {
                x: 0,   
                y: -0.1,   
                z: 0, 
                ease: "power1.out",
            }, "same").to(this.roomChildren.cube.rotation, {
                y: 2*Math.PI + Math.PI/4,
            }, "same").to(this.roomChildren.cube.position, {
                x: 4.06355,
                y: 5.67945,
                z: 1.09969,
            }, "same").to(this.roomChildren.cube.scale, {
                x: 10.2,
                y: 10.2,
                z: 10.2,
            }, "same").to(this.camera.orthographicCamera.position, {
                y: 2.5,
            }, "same").to(this.roomChildren.body.scale, {
                x: 1,
                y: 1,
                z: 1,
            }).to(this.roomChildren.cube.scale, {
                x: 0,
                y: 0,
                z: 0,
            }, "into-text").to( ".hero-main-title .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "into-text").to( ".hero-main-description .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "into-text").to( ".first-sub .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "into-text").to( ".second-sub .animatedis", {
                yPercent: 0,
                stagger: 0.07,
                ease: "back.out(1.7)",
            }, "into-text").to(this.roomChildren.aquarium.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            }, ">-0.1").to(this.roomChildren.rectLight.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.01,
            }, ">-0.1").to(this.roomChildren.fish.scale,{
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.01,
            }, ">-0.1").to(this.roomChildren.cube099.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            },">-0.1").to(this.roomChildren.shelves.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            },">-0.1").to(this.roomChildren.floor_items.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            },">-0.1").to(this.roomChildren.desks.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            },">-0.1").to(this.roomChildren.table_stuff.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
            },">-0.1").to(this.roomChildren.computer.scale, {
                x: 1,
                y: 1,
                z: 1,
                ease: "back.out(2.2)",
                duration: 0.5,
                onComplete: resolve,
            },">-0.1")
        });
    }

    onScroll(e){
        if(e.deltaY > 0){
            this.removeEventListeners();
            this.playSecondIntro();
        }
    }

    onTouch(e){
        this.initialY = e.touches[0].clientY;
    }

    onTouchMove(e){
        let currentY = e.touches[0].clientY;
        let difference = this.initialY - currentY;
        if(difference > 0){
            console.log("swiped up");
            this.removeEventListeners()
            this.playSecondIntro();
        }
        this.initialY = null;
    }

    removeEventListeners(){
        window.removeEventListener("wheel", this.scrollOnceEvent);
        window.removeEventListener("touchstart", this.touchStart);
        window.removeEventListener("touchmove", this.touchMove);
    }

    async playIntro(){
        await this.firstIntro();
        this.moveFlag = true;
        this.scrollOnceEvent = this.onScroll.bind(this);
        this.touchStart = this.onTouch.bind(this);
        this.touchMove = this.onTouchMove.bind(this);
        window.addEventListener("wheel", this.scrollOnceEvent);
        window.addEventListener("touchstart", this.touchStart);
        window.addEventListener("touchmove", this.touchMove);
    }

    async playSecondIntro(){
        this.moveFlag = false;
        this.scaleFlag = true;
        await this.secondIntro();
        this.scaleFlag = false;
        // this.emit("enablecontrols");
    }

    move(){
        if(this.device==="desktop"){
            this.room.position.set(-1,0,0);
        }else{
            this.room.position.set(0,0,-1);
        }
    }

    scale(){
        if(this.device==="desktop"){
            this.room.scale.set(0.11, 0.11, 0.11)
        }else {
            this.room.scale.set(0.07, 0.07, 0.07)
        }
    }

    update(){
        if(this.moveFlag){
            this.move();
        }
        if(this.scaleFlag){
            this.scale();
        }
    }
}