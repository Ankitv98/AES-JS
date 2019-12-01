let plaintext = "Two One Nine Two" 
let key = "Thats my Kung Fu";

const asbox =   [[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118],
                    [202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192],
                    [183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21],
                    [4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117],
                    [9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132],
                    [83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207],
                    [208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168],
                    [81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210],
                    [205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115],
                    [96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219],
                    [224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121],
                    [231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8],
                    [186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138],
                    [112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158],
                    [225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223],
                    [140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22]];


document.getElementById('plain').innerHTML = "Plaintext: " + "'" + plaintext + "'" 
document.getElementById('ki').innerHTML = "Key: " + "'" + key + "'"

function tobin(deci){
    return ( deci >>> 0 ).toString(2)
}

function padding(arraytopad){
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if(arraytopad[j][i].length < 8){ 
                for (let k = arraytopad[j][i].length; k < 8; k++)
                    arraytopad[j][i] = '0' + arraytopad[j][i];
            }
        }
    }    
    return arraytopad;
}

function findDegree(num){
    return (tobin(num)).length
  }

function leftshift(arraytoshift){
    let temp = [];
    for (let i = 0; i < 4 ;i++){
        temp[i] = [];
        for (let j = 0; j < 4; j++) {
             temp[i][j] = '00000000';
        }
    }
    for ( i = 0; i < 4; i++) {
        let si=0;
        for ( j = 0; j < 4; j++) {
            si = j + i;
            if(si > 3) si = si - 4;
            temp[i][j] = arraytoshift[i][si]; 
            }
    }
    return temp;
}

function keymat(str1){
    let arr = [];
    for (let i = 0; i < 4 ;i++){
        arr[i] = [];
        for (let j = 0; j < 4; j++) {
             arr[i][j] = '00000000';
        }
    }
    let count = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if(count<str1.length) arr[j][i] = tobin(str1.charCodeAt(count));
            count++;
        }
    }
    return padding(arr);
}

function tosbox(arraytosbox){
    let x,y;
        for(let i = 0; i < 4; i++){
            for (let j = 0; j < 4; j++) {
                x = (arraytosbox[i][j]).substring(0,4);
                y = (arraytosbox[i][j]).substring(4,8);
                x = parseInt(x,2);
                y = parseInt(y,2);
                arraytosbox[i][j] = tobin(asbox[x][y]);
            }
        }
    return padding(arraytosbox);        
}

function addroundkey(array1,array2){
    let arr2 = [];
    for (let i = 0; i < 4; i++) {
        arr2[i] = [];
        for (let j = 0; j < 4; j++) {
            arr2[i][j] = parseInt(array1[i][j],2) ^ parseInt(array2[i][j],2);
            arr2[i][j] = tobin(arr2[i][j]);
        }    
    }
    return padding(arr2);
}

function matrixmul(mat1, mat2){
    let temp1 = [];
    for (let i = 0; i < 4 ;i++){
        temp1[i] = [];
        for (let j = 0; j < 4; j++) {
             temp1[i][j] = '00000000';
        }
    }    
    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++){
            let xsum = 0;
            for (var k = 0; k < 4; k++){
                let mult = GFmultiply(parseInt(mat1[i][k]),parseInt(mat2[k][j],2),8); 
                xsum = xsum ^ parseInt(mult,2);
            }
            temp1[i][j] = tobin(xsum);
        }
    }
    return padding(temp1);
}

function mixcol(arraytomix){
    let mixColumn = [["02","03","01","01"],
                    ["01","02","03","01"],
                    ["01","01","02","03"],
                    ["03","01","01","02"]]
            return matrixmul(mixColumn,arraytomix);
}

function colgenera(key,roundnum){
    let roundconst = [];
    let fixround = [1,2,4,8,16,32,64,128,27,54];

    roundconst[0] = fixround[roundnum-1];
    for( let i = 1; i < 4 ; i++){
            roundconst[i] = 0;
    }
    let newcol = [];
    for(let j = 0; j < 4 ; j++){
        if(j<3) newcol[j] = key[j+1][3];
        else newcol[3] = key[0][3];
    }
    let x,y;
    for( i = 0; i < 4; i++){
            x = (newcol[i]).substring(0,4);
            y = (newcol[i]).substring(4,8);
            x = parseInt(x,2);
            y = parseInt(y,2);
            newcol[i] = tobin(asbox[x][y]);
        }
    for (i = 0; i < 4; i++) {
        newcol[i] = tobin(parseInt(newcol[i],2) ^ parseInt(roundconst[i])); 
    }
    let index = 0;
    while(index < 4){
        for( j = 0; j < 4; j++){
            key[j][index] = tobin(parseInt(key[j][index],2) ^ parseInt(newcol[j],2) );
            newcol[j] = key[j][index];
        }
        index += 1;
    }
    return padding(key);
}

function mattohexa(mtrix){
    let x,y;
    let matrix = []
        for(let i = 0; i < 4; i++){
            matrix[i] = [];
            for(let j = 0; j < 4; j++){
            x = (mtrix[i][j]).substring(0,4);
            y = (mtrix[i][j]).substring(4,8);
            x = parseInt(x,2).toString(16);
            y = parseInt(y,2).toString(16);
            matrix[i][j] = (x + y).toUpperCase();
            }    
        }
    return matrix;
}

function rotateLeftOneUnit(l){
    let temp = []
    temp = l.slice(1)
    temp.push(l[0])
    return temp
  }
  
  function leftShift(l, shiftBy){
    for(let i=0;i<shiftBy;i++){
      l = rotateLeftOneUnit(l)
    }
    return l
  }
  
  function xorList(l1,l2){
    let res = []
    for(let i=0;i<l1.length;i++){
      res.push(l1[i]^l2[i])
    }
    return res
  }
  
  function padTo15(str) {
    let padding = '';
    for(let i=0; i<15-str.length; i++) {
      padding += '0';
    }
    return padding + str;
  }
  
  function count(l,num){
    let count = 0
    for(let i=0;i<l.length;i++)
      if(l[i]==num){
        count++
      }
    return count
  }
  
function GFmultiply(A,B,N){
    A = tobin(A);
    B = tobin(B);
    A = padTo15(A);
    B = padTo15(B);
    let tempA = []
    let tempB = []
    for(let i=0;i<A.length;i++){
      tempA.push(parseInt(A.charAt(i)))
      tempB.push(parseInt(B.charAt(i)))
    }
    A = tempA
    B = tempB
    if(count(A,0)==2*N-1 || count(B,0)==2*N-1){
      return A
    }
    let res = []
    for(let i=0;i<2*N-1;i++){
      res[i] = 0
    }
    let shift_count = 2*(N-1)
    for(let i = 0;i<B.length;i++){
      if(B[i]==1){
        res = xorList(res, leftShift(A, shift_count))
      }
      shift_count -= 1
    }
    if(N == 8){
      let nonRed = [0,0,0,0,0,0,1,0,0,0,1,1,0,1,1]
      while(res.indexOf(1)<=6){
        let temp = res.indexOf(1)
        let count = 6 - temp
        let L = leftShift(nonRed, count)
        res = xorList(res, L)
      }
    }
    res_string = '';
    for(let ch of res) {
      res_string += ch;
    }
    return res_string.substring(7);
  }

function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
  
    tableData.forEach(function(rowData) {
      var row = document.createElement('tr');
  
      rowData.forEach(function(cellData) {
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(cellData));
        row.appendChild(cell);
      });
  
      tableBody.appendChild(row);
    });
  
    table.appendChild(tableBody);
    return table;
}

function htmlcontent(){
let plaintext_matrix = keymat(plaintext);
let key_matrix = keymat(key);
let result = addroundkey(plaintext_matrix,key_matrix);
let result1 = tosbox(result);
let result2 = leftshift(result1);
let result4 = mixcol(result2);
let result5 = colgenera(key_matrix,1);
let result6 = addroundkey(result4,result5);

  const tex = document.querySelector("#rounds")
  tex.innerHTML = "<center><H2>----------------- Initial Stage -----------------<br><br></H2></center>"
  tex.innerHTML += "<h3> Plaintext in 128-bit hexadecimal:</h3><br><br> "
  tex.appendChild(createTable(mattohexa(plaintext_matrix)))
  tex.innerHTML += "<h3> Key in 128-bit hexadecimal:</h3><br><br> "
  tex.appendChild(createTable(mattohexa(key_matrix)))
  tex.innerHTML += "<h3> State Matrix:</h3><br><br> "
  tex.appendChild(createTable(mattohexa(result)))
  for(let round = 1; round <= 10; round++){
      tex.innerHTML += "<center><br><br><H2>----------------- Round -----------------<br><br></H2><H2>" + round + "</H2></center><br><br>"
      tex.innerHTML += "<H3>After Substitute Byte:</H3><br><br>"
      tex.appendChild(createTable(mattohexa(result1)))
      tex.innerHTML += "<H3>After Shift rows:</H3><br><br>"
      tex.appendChild(createTable(mattohexa(result2)))
      tex.innerHTML += "<H3>After MixColumns:</H3><br><br>"
      tex.appendChild(createTable(mattohexa(result4)))
      tex.innerHTML += "<H3>New Key:</H3><br><br>"
      tex.appendChild(createTable(mattohexa(result5)))
      tex.innerHTML += "<H3>New State Matrix:</H3><br><br>"
      tex.appendChild(createTable(mattohexa(result6)))
      if(round<10){
            result1 = tosbox(result6);
            result2 = leftshift(result1);
            if(round<9) result4 = mixcol(result2);
            result5 = colgenera(result5,round + 1);
            if(round<9) result6 = addroundkey(result4,result5);
            else result6 = addroundkey(result2,result5); 
      }
  }
}

htmlcontent();