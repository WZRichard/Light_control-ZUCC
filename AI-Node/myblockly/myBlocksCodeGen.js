



  Blockly.JavaScript['var_convert'] = function(block) {
    var number_convert_num = block.getFieldValue('convert_num');
    
    var code = "bw_conveyor_"+number_convert_num;
 
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['node_red_return'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);

    var code = "msg['payload'] = "+value_name+';\n'+"return msg;\n";
    return code;
  };




  Blockly.JavaScript['sorte'] = function(block) {
    var number_conveyor_num = block.getFieldValue('conveyor_num');
    var angle_sorte_ang = block.getFieldValue('sorte_ang');
    var conveyor="bw_conveyor_"+number_conveyor_num;

    var code = "if(typeof bw_conveyor_"+number_conveyor_num+"==='undefined'){"+'\n'
    +"var "+conveyor+"= {'ang':["+number_conveyor_num+","+angle_sorte_ang+"]}"+';\n'
    +"}else{\n"
    +conveyor+".ang=new Array();\n"
    +conveyor+".ang=["+number_conveyor_num+","+angle_sorte_ang+"];\n"
    +"}"+'\n';

    return code;
  };

  Blockly.JavaScript['photogate'] = function(block) {
    var number_conveyor_num = block.getFieldValue('conveyor_num');
    var dropdown_photogate_val = block.getFieldValue('photogate_val');
  


    var code = "typeof  (JSON.parse(msg.payload).photogate) !=='undefined'&&JSON.parse(msg.payload).photogate[0]==="+number_conveyor_num+"&&JSON.parse(msg.payload).photogate["+dropdown_photogate_val+"]===1";
   
   
   
    return [code, Blockly.JavaScript.ORDER_NONE];
  };




  Blockly.JavaScript['conveyor_speed'] = function(block) {
    var number_conveyor_num = block.getFieldValue('conveyor_num');
    var number_name = block.getFieldValue('NAME');
    var dropdown_dir = block.getFieldValue('dir');
    var conveyor="bw_conveyor_"+number_conveyor_num;
    
    var code = "if(typeof bw_conveyor_"+number_conveyor_num+"==='undefined'){"+'\n'
    +"var "+conveyor+"= {'belt':["+number_conveyor_num+","+number_name+","+dropdown_dir+"]}"+';\n'
    +"}else{\n"
    +conveyor+".belt=new Array();\n"
    +conveyor+".belt=["+number_conveyor_num+","+number_name+","+dropdown_dir+"];\n"
    +"}"+'\n';
    return code;
  };

  Blockly.JavaScript['car_id'] = function(block) {
    var text_id = block.getFieldValue('id');
    var car="bw_car_"+text_id;

    
    var code = car;
   
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['car'] = function(block) {
    var text_carid = block.getFieldValue('carid');
    var number_speed = block.getFieldValue('speed');
    var dropdown_dir = block.getFieldValue('dir');
    var angle_dgr = block.getFieldValue('dgr');
    var number_p = block.getFieldValue('P');
    var number_i = block.getFieldValue('I');
    var number_d = block.getFieldValue('D');

    var car="bw_car_"+text_carid;
    var code = "var "+car+" ={};\n"
    +car+".AGV=new Array();\n"
    +"if("+dropdown_dir+"===0){\n"
    +car+".AGV=[0,-"+angle_dgr+","+number_speed+","+text_carid+","+number_p+","+number_i+","+number_d+"];\n"
    +"}else{\n"
    +car+".AGV=[0,"+angle_dgr+","+number_speed+","+text_carid+","+number_p+","+number_i+","+number_d+"];\n"
    +"}\n"
    
    return code;
  };

  Blockly.JavaScript['mobilenet'] = function(block) {
    var text_name = block.getFieldValue('NAME');
    
    var code ="typeof  (JSON.parse(msg.payload).object) !=='undefined'&&JSON.parse(msg.payload).object==='"+text_name+"'";
   
    
    return [code, Blockly.JavaScript.ORDER_NONE];
  };


  Blockly.JavaScript['rgb_id'] = function(block) {
    var number_id = block.getFieldValue('id');
    
    var code = "bw_rgbled_"+number_id;
    
    return [code, Blockly.JavaScript.ORDER_NONE];
  };


  Blockly.JavaScript['rgb'] = function(block) {
    var number_id = block.getFieldValue('id');
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var rgbled="bw_rgbled_"+number_id;
    var BW_R;var BW_G;var BW_B;
    function  getRGB(co){var panelCOLOR=(co+'').toUpperCase();var hex = [panelCOLOR.substr(2,3),panelCOLOR.substr(4,3),panelCOLOR.substr(6,3)];var rgb = [undefined,undefined,undefined];var hexABC = ['A','B','C','D','E','F'];var hexNum = [10,11,12,13,14,15];var i = -1;for(var x of hex){i=i+1;var m  = x.substr(0,1);var n = x.substr(1,1);if(isNaN(x) == false){rgb[i] = parseInt(m)*16+parseInt(n);BW_R=rgb[0];BW_G=rgb[1];BW_B=rgb[2];}else{if(hexABC.indexOf(m)>-1){var p = hexABC.indexOf(m);m = hexNum[p];}if(hexABC.indexOf(n)>-1){var q = hexABC.indexOf(n);n = hexNum[q];}rgb[i] = parseInt(m)*16+parseInt(n);BW_R=rgb[0];BW_G=rgb[1];BW_B=rgb[2];}}}
      if(value_name.substr(1,1)=="#"){
        getRGB(value_name)
        

        var code = "if(typeof bw_rgbled_"+number_id+"==='undefined'){"+'\n'
        +"var "+rgbled+"= {'RGB':["+number_id+","+BW_R+","+BW_G+","+BW_B+"]}"+';\n'
        +"}else{\n"
        +rgbled+".RGB=new Array();\n"
        +rgbled+".RGB=["+number_id+","+BW_R+","+BW_G+","+BW_B+"];\n"
        +"}"+'\n';
        return code;
        
      }
      else{
        var code ="var BW_R;var BW_G;var BW_B;\n"+
        "function  getRGB(co){var panelCOLOR=(co+'').toUpperCase();var hex = [panelCOLOR.substr(1,2),panelCOLOR.substr(3,2),panelCOLOR.substr(5,2)];var rgb = [undefined,undefined,undefined];var hexABC = ['A','B','C','D','E','F'];var hexNum = [10,11,12,13,14,15];var i = -1;for(var x of hex){i=i+1;var m  = x.substr(0,1);var n = x.substr(1,1);if(isNaN(x) == false){rgb[i] = parseInt(m)*16+parseInt(n);BW_R=rgb[0];BW_G=rgb[1];BW_B=rgb[2];}else{if(hexABC.indexOf(m)>-1){var p = hexABC.indexOf(m);m = hexNum[p];}if(hexABC.indexOf(n)>-1){var q = hexABC.indexOf(n);n = hexNum[q];}rgb[i] = parseInt(m)*16+parseInt(n);BW_R=rgb[0];BW_G=rgb[1];BW_B=rgb[2];}}}\n"+
        "getRGB("+value_name+")\n"+
        "if(typeof bw_rgbled_"+number_id+"==='undefined'){"+'\n'
        +"var "+rgbled+"= {'RGB':["+number_id+",BW_R,BW_G,BW_B]}"+';\n'
        +"}else{\n"
        +rgbled+".RGB=new Array();\n"
        +rgbled+".RGB=["+number_id+",BW_R,BW_G,BW_B];\n"
        +"}"+'\n';
      }

    return code;
  };

  Blockly.JavaScript['light_control'] = function(block) {
    var value___1 = Blockly.JavaScript.valueToCode(block, '灯泡1', Blockly.JavaScript.ORDER_ATOMIC);
    var value___2 = Blockly.JavaScript.valueToCode(block, '灯泡2', Blockly.JavaScript.ORDER_ATOMIC);
    var value___3 = Blockly.JavaScript.valueToCode(block, '灯泡3', Blockly.JavaScript.ORDER_ATOMIC);
    var value___4 = Blockly.JavaScript.valueToCode(block, '灯泡4', Blockly.JavaScript.ORDER_ATOMIC);
    var value___5 = Blockly.JavaScript.valueToCode(block, '灯泡5', Blockly.JavaScript.ORDER_ATOMIC);

    var code = "\'["+value___1+","+value___2+","+value___3+","+value___4+","+value___5+"]\'";

    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['light_control2.0'] = function(block) {
    var dropdown_pa = block.getFieldValue('pa');
    var dropdown_pb = block.getFieldValue('pb');
    var dropdown_pc = block.getFieldValue('pc');
    var dropdown_pd = block.getFieldValue('pd');
    var dropdown_pe = block.getFieldValue('pe');
    // TODO: Assemble JavaScript into code variable.
    var code = "\'["+dropdown_pa+","+dropdown_pb+","+dropdown_pc+","+dropdown_pd+","+dropdown_pe+"]\'";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };

  Blockly.JavaScript['light_control3.0'] = function(block) {
    var dropdown__auto = block.getFieldValue('_auto');
    var dropdown_pa = block.getFieldValue('pa');
    var dropdown_pb = block.getFieldValue('pb');
    var dropdown_pc = block.getFieldValue('pc');
    var dropdown_pd = block.getFieldValue('pd');
    var dropdown_pe = block.getFieldValue('pe');
    // TODO: Assemble JavaScript into code variable.
    if (dropdown__auto == '8') var code = "\'["+0+","+Math.round(Math.random())+","+Math.round(Math.random())+","+Math.round(Math.random())+","+Math.round(Math.random())+","+Math.round(Math.random())+"]\'";
    else var code = "\'["+dropdown__auto+","+dropdown_pa+","+dropdown_pb+","+dropdown_pc+","+dropdown_pd+","+dropdown_pe+"]\'";
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  };