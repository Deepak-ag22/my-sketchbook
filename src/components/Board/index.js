import { useDispatch, useSelector } from 'react-redux'
import { useEffect,useLayoutEffect, useRef } from "react";
import { MENUITEMS } from '@/constants';
import { menuItemclick, actionItemclick} from '@/slice/menuSlice';
import { socket } from '@/socket';
const Board = ()=>{
    const dispatch=useDispatch()
    const canvasRef= useRef(null);
    const drawhistory=useRef([])
    const hisp=useRef(0)
    
    const shouldDraw=useRef(false);
    const {activeMenuItem,actionMenuItem}=useSelector((state)=>state.menu)
    const {color,size}=useSelector((state)=>state.toolbox[activeMenuItem])

    useEffect(()=>{
        if(!canvasRef.current) return;
        const canvas=canvasRef.current;
        const context=canvas.getContext("2d");
        if(actionMenuItem==MENUITEMS.DOWNLOAD){
            const URL=canvas.toDataURL();
            const anchor=document.createElement('a');
            anchor.href=URL;
            anchor.download='sketch.png'
            anchor.click()
        }
        else if(actionMenuItem===MENUITEMS.UNDO || actionMenuItem===MENUITEMS.REDO){
            if(hisp.current>0 && actionMenuItem===MENUITEMS.UNDO){
                hisp.current--;
            }
            if(hisp.current<drawhistory.current.length-1 && actionMenuItem===MENUITEMS.REDO){
                hisp.current++;
            }
            const imagedata=drawhistory.current[hisp.current]
            context.putImageData(imagedata,0,0)
        }
        dispatch(actionItemclick(null))
    },[actionMenuItem,dispatch])
    useEffect(()=>{
        if(!canvasRef.current) return;
        const canvas=canvasRef.current;
        const context=canvas.getContext("2d");
        const changeConfig=(color,size)=>{
            context.strokeStyle=color;
            context.lineWidth=size;
        }
        const handleChangeConfig=(config)=>{
            changeConfig(config.color,config.size)
        }
        changeConfig(color,size);
        socket.on('changeConfig',handleChangeConfig)
        return ()=>{
            socket.off('changeConfig',handleChangeConfig)
        }
    },[color,size])
    useLayoutEffect(()=>{
        if(!canvasRef.current) return;
        const canvas=canvasRef.current;
        const context=canvas.getContext("2d");

        //when mouting
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
        
        const beginPath=(x,y)=>{
            context.beginPath();
            context.moveTo(x,y);
        }
        const drawLine=(x,y)=>{
            context.lineTo(x,y);
            context.stroke()
        }
        const handleMouseDown=(e)=>{
            shouldDraw.current=true;
            beginPath(e.clientX,e.clientY)
            socket.emit('beginpath',{x:e.clientX,y:e.clientY})
        }
        const handleMouseMove=(e)=>{
            if(!shouldDraw.current) return;
            drawLine(e.clientX,e.clientY)
            socket.emit('drawLine',{x:e.clientX,y:e.clientY})
        }
        const handleMouseUp=(e)=>{
            shouldDraw.current=false;
            const imagedata=context.getImageData(0,0,canvas.width,canvas.height);
            drawhistory.current.push(imagedata);
            hisp.current=drawhistory.current.length-1;
        }
        const handleBeginPath=(path)=>{
            beginPath(path.x,path.y)
        }
        const handleDrawLine=(path)=>{
            drawLine(path.x,path.y)
        }
        canvas.addEventListener('mousedown',handleMouseDown)
        canvas.addEventListener('mousemove',handleMouseMove)
        canvas.addEventListener('mouseup',handleMouseUp)
        socket.on('beginPath',handleBeginPath)
        socket.on('drawLine',handleDrawLine)
        return ()=>{
            canvas.removeEventListener('mousedown',handleMouseDown)
            canvas.removeEventListener('mousemove',handleMouseMove)
            canvas.removeEventListener('mouseup',handleMouseUp)

            socket.off('beginPath',handleBeginPath)
            socket.off('drawLine',handleDrawLine)
        }
    },[])
    return (<canvas ref={canvasRef}></canvas>)

}
export default Board;