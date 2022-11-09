import * as THREE from "three";
import Experience from "../Experience.js";
import GSAP from "gsap";
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import Floor from "./Floor.js";

export default class Room{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        this.roomChildren = {};

        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
    }

    setModel(){
        this.actualRoom.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;

            if(child instanceof THREE.Group){
                child.children.forEach((groupchild)=>{
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                })
            }

            if(child.name === "Aquarium"){
                const glass = child.children[0];
                glass.material = new THREE.MeshPhysicalMaterial();
                glass.material.roughness = 0;
                glass.material.color.set(0x549dd2);
                glass.material.ior = 3;
                glass.material.transmission = 1;
                glass.material.opacity = 1;
            }

            if(child.name === "Computer"){
                child.children[1].material = new THREE.MeshBasicMaterial({
                    map: this.resources.items.screen,
                })
            }

            if(child.name === "Mini_Floor"){
                child.position.x = 10.1146;
                child.position.z = -4.29762;
            }
            // if(child.name === "Mailbox" || 
            // child.name === "Lamp" ||
            // child.name === "Floor_First" ||
            // child.name === "Floor_Second" ||
            // child.name === "Floor_Third" ||
            // child.name === "Dirt" ||
            // child.name === "Flower" ){
            //     child.scale.set(0,0,0);
            // }
            child.scale.set(0,0,0);
            if(child.name === "Cube"){
                child.scale.set(1,1,1);
                child.position.set(0,-1.5,0);
                child.rotation.Y = Math.PI/4
            }

            this.roomChildren[child.name.toLowerCase()] = child;
        });

        const width = 0.5;
        const height = 0.7;
        const intensity = 1;
        const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
        rectLight.position.set( 13, 2, -0.95 );
        rectLight.rotation.x = -Math.PI/2;
        rectLight.rotation.z = Math.PI/4;
        this.actualRoom.add( rectLight )

        this.roomChildren["rectLight"] = rectLight;
        rectLight.scale.set(0,0,0);

        //const rectLightHelper = new RectAreaLightHelper( rectLight );
        //rectLight.add( rectLightHelper );

        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.11,0.11,0.11);

    }

    setAnimation(){
        this.mixer = new THREE.AnimationMixer(this.actualRoom);
        this.swim = this.mixer.clipAction(this.room.animations[0]);
        this.swim.play();
    }
    
    onMouseMove(){
        window.addEventListener("mousemove", (e)=>{
            this.rotation = ((e.clientX-window.innerWidth/2)*2)/ window.innerWidth;
            this.lerp.target = this.rotation*0.2;
        });
    }
    resize(){
    }

    update(){
        this.mixer.update(this.time.delta * .0009);

        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.actualRoom.rotation.y = this.lerp.current;
    }

}

