import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger.js";
import ASScroll from '@ashthornton/asscroll'
import THREEx from 'threex.domevents/'


export default class Controls{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.camera = this.experience.camera;
        this.room = this.experience.world.room.actualRoom;
        this.room.children.forEach(child=>{
            if (child.type==="RectAreaLight"){
                this.rectLight = child;
            }
            if(child.name ==="Aquarium"){
                this.clickable = child;
            }
        })
        this.circleFirst = this.experience.world.floor.circleFirst;
        this.circleSecond = this.experience.world.floor.circleSecond;
        this.circleThird = this.experience.world.floor.circleThird;
        GSAP.registerPlugin(ScrollTrigger);

        document.querySelector(".page").style.overflow = "visible";
        this.setSmoothScroll();
        this.setScrollTrigger();
    }

    setupASScroll() {
        // https://github.com/ashthornton/asscroll
        const asscroll = new ASScroll({
            disableRaf: true });
      
      
        GSAP.ticker.add(asscroll.update);
      
        ScrollTrigger.defaults({
          scroller: asscroll.containerElement });
      
      
        ScrollTrigger.scrollerProxy(asscroll.containerElement, {
          scrollTop(value) {
            if (arguments.length) {
              asscroll.currentPos = value;
              return;
            }
            return asscroll.currentPos;
          },
          getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
          },
          fixedMarkers: true });
      
      
        asscroll.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", asscroll.resize);
      
        requestAnimationFrame(() => {
          asscroll.enable({
            newScrollElements: document.querySelectorAll(".gsap-marker-start, .gsap-marker-end, [asscroll]") });
      
        });
        return asscroll;
      }

    setSmoothScroll(){
        this.asscroll = this.setupASScroll();
    }

    setScrollTrigger(){
        ScrollTrigger.matchMedia({
            //desktop
	        "(min-width: 969px)": () => {
                console.log("Desktopppp");

                //resets
                this.room.scale.set(0.11, 0.11, 0.11);
                this.rectLight.width = 0.5;
                this.rectLight.height = 0.7;

                //first section
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                });
                this.firstMoveTimeline.to(this.room.position, {
                    x: ()=>{
                        return this.sizes.width * 0.0014;
                    }
                });

                //second section
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                })
                .to(this.room.position, {
                    x: ()=>{
                        return -1.2;
                    },
                    y: ()=>{
                        return 1;
                    },
                    z: ()=>{
                        return this.sizes.height * 0.0032;
                    },   
                }, "same")
                .to(this.room.scale, {
                    x: 0.4,
                    y: 0.4,
                    z: 0.4,
                }, "same")
                .to(this.rectLight, {
                    width: 0.5*4,
                    height: 0.7*4,
                }, "same");

                //third section
                this.thirdMoveTimeline = new GSAP.timeline({ 
                    scrollTrigger:{
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }) .to(this.camera.orthographicCamera.position, {
                    y: -1,
                    x: -5.1,
                });
              
            },
            //mobile
	        "(max-width: 968px)": () => {

                //resets
                this.room.scale.set(0.09, 0.09, 0.09);
                this.room.position.set(0.0, 0.0, 0.0);
                this.rectLight.width = 0.3;
                this.rectLight.height = 0.4;

                //first section
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.scale,{
                    x: 0.1,
                    y: 0.1,
                    z: 0.1
                });

                //second section
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.room.scale,{
                    x: 0.2,
                    y: 0.2,
                    z: 0.2
                }, "same").to(this.rectLight, {
                    width: 0.3 * 3.4,
                    height: 0.4 * 3.4,
                }, "same").to(this.room.position, {
                    x: 0.2,
                }, "same")

                //third section
                this.thirdMoveTimeline = new GSAP.timeline({ 
                    scrollTrigger:{
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.room.position,{
                    z: -2,
                });
            },
              
            // all 
            "all": ()=> {

                //section animation
                this.sections = document.querySelectorAll(".section");
                this.sections.forEach((section)=>{
                    this.progressWrapper = section.querySelector(".progress-wrapper");
                    this.progressBar = section.querySelector(".progress-bar");

                    if (section.classList.contains("right")){
                        GSAP.to(section, {
                            borderTopLeftRadius: 10,
                            scrollTrigger:{
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            }
                        });
                        GSAP.to(section, {
                            borderBottomLeftRadius: 700,
                            scrollTrigger:{
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            }
                        });
                    } else{
                        GSAP.to(section, {
                            borderTopRightRadius: 10,
                            scrollTrigger:{
                                trigger: section,
                                start: "top bottom",
                                end: "top top",
                                scrub: 0.6,
                            }
                        });
                        GSAP.to(section, {
                            borderBottomRightRadius: 700,
                            scrollTrigger:{
                                trigger: section,
                                start: "bottom bottom",
                                end: "bottom top",
                                scrub: 0.6,
                            },
                        });
                    }
                    GSAP.from(this.progressBar, {
                        scaleY: 0,
                        scrollTrigger:{
                            trigger: section,
                            start: "top top",
                            end: "bottom bottom",
                            scrub: 0.4,
                            pin: this.progressWrapper,
                            pinSpacing: false,
                        },
                    })
                })

                //all animations
                //first section
                this.firstMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".first-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleFirst.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                })

                //second section
                this.secondMoveTimeline = new GSAP.timeline({
                    scrollTrigger:{
                        trigger: ".second-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    }
                }).to(this.circleSecond.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                }, "same").to(this.room.position, {
                    y: 1.5,
                }, "same")

                //third section
                this.thirdMoveTimeline = new GSAP.timeline({ 
                    scrollTrigger:{
                        trigger: ".third-move",
                        start: "top top",
                        end: "bottom bottom",
                        scrub: 0.6,
                        invalidateOnRefresh: true,
                    },
                }).to(this.circleThird.scale, {
                    x: 3,
                    y: 3,
                    z: 3,
                })

                // Mini platform animations
              this.secondPartTimeline = new GSAP.timeline({ 
                scrollTrigger:{
                    trigger: ".third-move",
                    start: "center center",
                },
                });

                this.room.children.forEach(child=>{
                    if(child.name=== "Mini_Floor"){
                        this.first = GSAP.to(child.position, {
                            x: 4.00921,
                            z: 1.80774,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                        this.tenth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                        })
                    }
                    if(child.name=== "Mailbox"){
                        this.second = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(5)",
                            duration: 0.3
                        })
                    }
                    if(child.name=== "Lamp"){
                        this.third = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if(child.name=== "Floor_First"){
                        this.fourth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if(child.name=== "Floor_Second"){
                        this.fifth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if(child.name=== "Floor_Third"){
                        this.sixth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if(child.name=== "Flower"){
                        this.eighth = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                    if(child.name=== "Dirt"){
                        this.seventh = GSAP.to(child.scale, {
                            x: 1,
                            y: 1,
                            z: 1,
                            ease: "back.out(2)",
                            duration: 0.3
                        })
                    }
                });
                this.secondPartTimeline.add(this.first);
                this.secondPartTimeline.add(this.tenth);
                this.secondPartTimeline.add(this.second);
                this.secondPartTimeline.add(this.third);
                this.secondPartTimeline.add(this.fourth, "-=0.2");
                this.secondPartTimeline.add(this.fifth, "-=0.2");
                this.secondPartTimeline.add(this.sixth, "-=0.2");
                this.secondPartTimeline.add(this.seventh, "-=0.2");
                this.secondPartTimeline.add(this.eighth, "-=0.2");
            }
        });
    }

    resize(){}

    update(){}
}

