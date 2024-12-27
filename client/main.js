var socket = io();

const map_id=document.getElementById('map1');
const map2_id=document.getElementById('map2');

var rotated=false;
var map=[],map2=[],vis=[],vis2=[];

for(let i=0;i<10;i++){
    map[i]=[];
    map2[i]=[];
    vis[i]=[];
    vis2[i]=[];
    for(let j=0;j<10;j++){
        map[i][j]=0;
        map2[i][j]=0;
        vis[i][j]=0;
        vis2[i][j]=0;
    }
}

document.addEventListener('contextmenu', e => e.preventDefault());

function get(i,j){
    if(i<0 || i>=10 || j<0 || j>=10){
        return 0;
    }
    return map[i][j];
}

function get2(i,j){
    if(i<0 || i>=10 || j<0 || j>=10){
        return 0;
    }
    return map2[i][j];
}

function get_vis(i,j){
    if(i<0 || i>=10 || j<0 || j>=10){
        return 1;
    }
    return vis[i][j];
}

function is_available(i,j){
    if(len==0){
        return;
    }
    if(!rotated){
        if(j+len-1>=10){
            return false;
        }
        for(let x=i-1;x<=i+1;x++){
            for(let y=j-1;y<=j+len;y++){
                if(get(x,y)){
                    return false;
                }
            }
        }
        return true;
    }
    else{
        if(i-len+1<0){
            return false;
        }
        for(let x=i-len;x<=i+1;x++){
            for(let y=j-1;y<=j+1;y++){
                if(get(x,y)){
                    return false;
                }
            }
        }
        return true;
    }
}

function draw_cell(i,j,s){
    if(i<0 || i>=10 || j<0 || j>=10)return;
    if(s=='')document.getElementById('cell'+i+j).style.backgroundImage="none";
    else if(s=='x' || s=='_x')document.getElementById('cell'+i+j).style.backgroundImage="url('/client/x.png')"
    else document.getElementById('cell'+i+j).style.backgroundImage="url('/client/gemi_"+s+".png')";
    return;
}

function draw_cell2(i,j,s){
    if(i<0 || i>=10 || j<0 || j>=10)return;
    if(s=='')document.getElementById('Cell'+i+j).style.backgroundImage="none";
    else if(s=='x')document.getElementById('Cell'+i+j).style.backgroundImage="url('/client/x.png')";
    else{
        if(s.substring(0,4)=='basi' || s.substring(0,4)=='sonu' || (s=='tekli' && is_completed(i,j))){
            draw_Xs(i,j,'around');
        }
        else if(s=='ortasi'){
            draw_Xs(i,j,'horizontal');
        }
        else if(s=='ortasi_dik'){
            draw_Xs(i,j,'vertical');
        }
        else{
            draw_Xs(i,j,'corners');
        }
        document.getElementById('Cell'+i+j).style.backgroundImage="url('/client/gemi_"+s+".png')";
    }
    return;
}

function update_map(){
    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            let add='';
            if(vis2[i][j]){
                add='_x';
            }
            if(map[i][j]==1){
                draw_cell(i,j,'basi'+add);
            }
            else if(map[i][j]==2){
                draw_cell(i,j,'ortasi'+add);
            }
            else if(map[i][j]==3){
                draw_cell(i,j,'sonu'+add);
            }
            else if(map[i][j]==4){
                draw_cell(i,j,'basi_dik'+add);
            }
            else if(map[i][j]==5){
                draw_cell(i,j,'ortasi_dik'+add);
            }
            else if(map[i][j]==6){
                draw_cell(i,j,'sonu_dik'+add);
            }
            else if(map[i][j]==7){
                draw_cell(i,j,'tekli'+add);
            }
            else{
                draw_cell(i,j,''+add);
            }
        }
    }
}

function is_completed(i,j){
    if(map2[i][j]==7){
        return true;
    }
    if(map2[i][j]<=3){
        let x;
        for(x=j;map2[i][x]!=1;x--){
            if(!vis[i][x]){
                return false;
            }
        }
        if(!vis[i][x]){
            return false;
        }
        for(x=j;map2[i][x]!=3;x++){
            if(!vis[i][x]){
                return false;
            }
        }
        if(!vis[i][x]){
            return false;
        }
    }
    else{
        let y;
        for(y=i;map2[y][j]!=4;y++){
            if(!vis[y][j]){
                return false;
            }
        }
        if(!vis[y][j]){
            return false;
        }
        for(y=i;map2[y][j]!=6;y--){
            if(!vis[y][j]){
                return false;
            }
        }
        if(!vis[y][j]){
            return false;
        }
    }
    return true;
}

function draw_Xs(i,j,type){
    if(type=='around'){
        for(let x=-1;x<=1;x++){
            for(let y=-1;y<=1;y++){
                if(i+x<0 || i+x>=10 || j+y<0 || j+y>=10 || get2(i+x,j+y))continue;
                vis[i+x][j+y]=1;
                draw_cell2(i+x,j+y,'x');
            }
        }
    }
    else if(type=='horizontal'){
        for(let x=-1;x<=1;x+=2){
            for(let y=-1;y<=1;y++){
                if(i+x<0 || i+x>=10 || j+y<0 || j+y>=10 || get2(i+x,j+y))continue;
                vis[i+x][j+y]=1;
                draw_cell2(i+x,j+y,'x');
            }
        }
    }
    else if(type=='vertical'){
        for(let x=-1;x<=1;x++){
            for(let y=-1;y<=1;y+=2){
                if(i+x<0 || i+x>=10 || j+y<0 || j+y>=10 || get2(i+x,j+y))continue;
                vis[i+x][j+y]=1;
                draw_cell2(i+x,j+y,'x');
            }
        }
    }
    else if(type=='corners'){
        for(let x=-1;x<=1;x+=2){
            for(let y=-1;y<=1;y+=2){
                if(i+x<0 || i+x>=10 || j+y<0 || j+y>=10 || get2(i+x,j+y))continue;
                vis[i+x][j+y]=1;
                draw_cell2(i+x,j+y,'x');
            }
        }
    }
    return;
}

function update_map2(){
    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            if(!vis[i][j]){
                draw_cell2(i,j,'');
            }
            else{
                if(map2[i][j]==0){
                    draw_cell2(i,j,'x');
                }
                else if(map2[i][j]==1){
                    if(is_completed(i,j)){
                        draw_cell2(i,j,'basi');
                    }
                    else if(get_vis(i,j+1)){
                        if(get_vis(i,j-1)){
                            draw_cell2(i,j,'basi');
                        }
                        else{
                            draw_cell2(i,j,'ortasi');
                        }
                    }
                    else if(!get_vis(i+1,j) || !get_vis(i-1,j)){
                        draw_cell2(i,j,'tekli');
                    }
                    else if(get_vis(i,j-1)){
                        draw_cell2(i,j,'basi');
                    }
                    else{
                        draw_cell2(i,j,'ortasi');
                    }
                }
                else if(map2[i][j]==2){
                    if(is_completed(i,j)){
                        draw_cell2(i,j,'ortasi');
                    }
                    else if(get_vis(i,j-1) || get_vis(i,j+1)){
                        draw_cell2(i,j,'ortasi');
                    }
                    else if(!get_vis(i+1,j) || !get_vis(i-1,j)){
                        draw_cell2(i,j,'tekli');
                    }
                    else{
                        draw_cell2(i,j,'ortasi');
                    }
                }
                else if(map2[i][j]==3){
                    if(is_completed(i,j)){
                        draw_cell2(i,j,'sonu');
                    }
                    else if(get_vis(i,j-1)){
                        if(get_vis(i,j+1)){
                            draw_cell2(i,j,'sonu');
                        }
                        else{
                            draw_cell2(i,j,'ortasi');
                        }
                    }
                    else if(!get_vis(i+1,j) || !get_vis(i-1,j)){
                        draw_cell2(i,j,'tekli');
                    }
                    else if(get_vis(i,j+1)){
                        draw_cell2(i,j,'sonu');
                    }
                    else{
                        draw_cell2(i,j,'ortasi');
                    }
                }
                else if(map2[i][j]==4){
                    if(is_completed(i,j)){
                        draw_cell2(i,j,'basi_dik');
                    }
                    else if(get_vis(i-1,j)){
                        if(get_vis(i+1,j)){
                            draw_cell2(i,j,'basi_dik');
                        }
                        else{
                            draw_cell2(i,j,'ortasi_dik');
                        }
                    }
                    else if(!get_vis(i,j-1) || !get_vis(i,j+1)){
                        draw_cell2(i,j,'tekli');
                    }
                    else if(get_vis(i+1,j)){
                        draw_cell2(i,j,'basi_dik');
                    }
                    else{
                        draw_cell2(i,j,'ortasi_dik');
                    }
                }
                else if(map2[i][j]==5){
                    if(is_completed(i,j)){
                        draw_cell2(i,j,'ortasi_dik');
                    }
                    else if(get_vis(i+1,j) || get_vis(i-1,j)){
                        draw_cell2(i,j,'ortasi_dik');
                    }
                    else if(!get_vis(i,j-1) || !get_vis(i,j+1)){
                        draw_cell2(i,j,'tekli');
                    }
                    else{
                        draw_cell2(i,j,'ortasi_dik');
                    }
                }
                else if(map2[i][j]==6){
                    if(is_completed(i,j)){
                        draw_cell2(i,j,'sonu_dik');
                    }
                    else if(get_vis(i+1,j)){
                        if(get_vis(i-1,j)){
                            draw_cell2(i,j,'sonu_dik');
                        }
                        else{
                            draw_cell2(i,j,'ortasi_dik');
                        }
                    }
                    else if(!get_vis(i,j-1) || !get_vis(i,j+1)){
                        draw_cell2(i,j,'tekli');
                    }
                    else if(get_vis(i-1,j)){
                        draw_cell2(i,j,'sonu_dik');
                    }
                    else{
                        draw_cell2(i,j,'ortasi_dik');
                    }
                }
                else{
                    draw_cell2(i,j,'tekli');
                }
            }
        }
    }
}

function draw_ship(i,j){
    update_map();
    if(len==0){
        return;
    }
    let s='';
    if(!is_available(i,j)){
        s='_kirmizi';
    }
    if(len==1){
        draw_cell(i,j,'tekli'+s);
    }
    else if(!rotated){
        draw_cell(i,j,'basi'+s);
        for(let x=1;x<len-1;x++){
            draw_cell(i,j+x,'ortasi'+s);
        }
        draw_cell(i,j+len-1,'sonu'+s);
    }
    else{
        s='_dik'+s;
        draw_cell(i,j,'basi'+s);
        for(let x=1;x<len-1;x++){
            draw_cell(i-x,j,'ortasi'+s);
        }
        draw_cell(i-len+1,j,'sonu'+s);
    }
}

function add_ship(i,j){
    if(!is_available(i,j))return;
    if(len==1){
        map[i][j]=7;
    }
    else if(!rotated){
        map[i][j]=1;
        for(let x=1;x<len-1;x++){
            map[i][j+x]=2;
        }
        map[i][j+len-1]=3;
    }
    else{
        map[i][j]=4;
        for(let x=1;x<len-1;x++){
            map[i-x][j]=5;
        }
        map[i-len+1][j]=6;
    }
    ships[len]--;
    if(ships[len]==0)change_ship();
    update_map();
    return;
}

var ships=[0,4,3,2,1],len=2,last_x=-1,last_y=-1;

function change_ship(){
    let no_ship=true;
    for(let i=1;i<=4;i++){
        if(ships[i]){
            no_ship=false;
        }
    }
    if(no_ship){
        len=0;
        map_id.style.cursor="default";
        socket.emit('ready',map);
        return;
    }
    for(len=(len+1)%5;!ships[len];len=(len+1)%5);
}

document.getElementsByTagName('html')[0].addEventListener('keydown',function (e)
{
    let keycode1 = (e.keyCode ? e.keyCode : e.which);
    if (keycode1 == 0 || keycode1 == 9) {
        e.preventDefault();
        e.stopPropagation();
        change_ship();
        if(last_x!=-1){
            draw_ship(last_x,last_y);
        }
    }
});

for(let i=0;i<10;i++){
    for(let j=0;j<10;j++){
        const cell=document.createElement('div');
        cell.className="cells";
        cell.id="cell"+i+j;
        //cell.innerHTML=i*10+j+1;
        cell.addEventListener('mouseover',function(){
            last_x=i;
            last_y=j;
            draw_ship(i,j);
        });
        cell.addEventListener('mouseout',function(){
            last_x=-1;
            last_y=-1;
            update_map();
        });
        cell.addEventListener('mousedown',function(event){
            console.log(event.button);
            if(event.button==0){
                add_ship(i,j);
            }
            else if(event.button==2){
                update_map();
                rotated^=1;
                draw_ship(i,j);
            }
        });
        cell.addEventListener('keydown',function (e){
            let keycode1 = (e.keyCode ? e.keyCode : e.which);
            console.log(e.keyCode);
            if (keycode1 == 0 || keycode1 == 82) {
                e.preventDefault();
                e.stopPropagation();
                update_map();
                rotated^=1;
                draw_ship(i,j);
            }
        });
        map_id.appendChild(cell);
    }
}

var turn;

for(let i=0;i<10;i++){
    for(let j=0;j<10;j++){
        const cell=document.createElement('div');
        cell.className="cells";
        cell.id="Cell"+i+j;
        cell.addEventListener('mousedown',function(event){
            if(event.button==0){
                if(vis[i][j] || turn=='opponents'){
                    return;
                }
                vis[i][j]=1;
                update_map2();
                socket.emit('move_made',vis);
                turn='opponents';
            }
        })
        map2_id.appendChild(cell);
    }
}

socket.on('game_started',function(){
    console.log('game_started');
    document.getElementById('waiting').style.visibility="hidden";
    map_id.style.visibility="visible";
});

socket.on('both_ready',function(data){
    map2_id.style.visibility="visible";
    map2=data[0];
    turn=data[1];
    update_map2();
});

socket.on('turn',function(data){
    turn='mine';
    vis2=data;
    update_map();
});

socket.on('restart',function(){
    for(let i=0;i<10;i++){
        for(let j=0;j<10;j++){
            map[i][j]=map2[i][j]=vis[i][j]=vis2[i][j];
        }
    }
    ships=[0,4,3,2,1];
    len=2;
    last_x=-1,last_y=-1;
    rotated=false;
    document.getElementById('waiting').style.visibility="visible";
    map_id.style.visibility="hidden";
    map2_id.style.visibility="hidden";
    map_id.style.cursor="grabbed";
});
