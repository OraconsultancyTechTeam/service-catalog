/*
*   Change Menu stage when clicked
*/
/*
$('.stages').click(function () {
    var id = $(this).attr('id')
    var stage = document.getElementById(id).innerHTML
    $('#current_stage').html(stage)
    blockController(stage)
    
    // Need to add in loading content specific to chosen stage
    // and set to content div
})*/
var step = false;
var section1 ='Database Engine'
var section2 = 'Features'
var section3 = 'Sizing and Parameters'
var section4= 'Additional Info and Save'

//this controller opens and closes blocks
function blockController(stage){
  switch(stage) {
    case section1:
      document.getElementById('block1').style.display='block'
      document.getElementById('block2').style.display='block'

      document.getElementById('featuresBlock').style.display='none'
      document.getElementById('block3').style.display='none'
      document.getElementById('block4').style.display='none' 

      document.getElementById('SandPBlock').style.display='none'
      document.getElementById('block5').style.display='none'
      document.getElementById('block6').style.display='none'
     
      document.getElementById('InfoBlock').style.display='none'
      document.getElementById('block7').style.display='none'
      document.getElementById('block8').style.display='none'
     
      break;
    case section2:
      document.getElementById('block1').style.display='none'
      document.getElementById('block2').style.display='none'

      document.getElementById('featuresBlock').style.display='block'
      document.getElementById('block3').style.display='block'
      document.getElementById('block4').style.display='block'
    
      document.getElementById('SandPBlock').style.display='none'
      document.getElementById('block5').style.display='none'
      document.getElementById('block6').style.display='none'

      document.getElementById('InfoBlock').style.display='none'
      document.getElementById('block7').style.display='none'
      document.getElementById('block8').style.display='none'
      
      break;
    case section3:
    document.getElementById('block1').style.display='none'
    document.getElementById('block2').style.display='none'

    document.getElementById('featuresBlock').style.display='none'
    document.getElementById('block3').style.display='none'
    document.getElementById('block4').style.display='none'

    document.getElementById('SandPBlock').style.display='block'
    document.getElementById('block5').style.display='block'
    document.getElementById('block6').style.display='block'

    document.getElementById('InfoBlock').style.display='none'
    document.getElementById('block7').style.display='none'
    document.getElementById('block8').style.display='none'
      
    break;
    case section4:
      document.getElementById('block1').style.display='none'
      document.getElementById('block2').style.display='none'

      document.getElementById('featuresBlock').style.display='none'
      document.getElementById('block3').style.display='none'
      document.getElementById('block4').style.display='none'
  
      document.getElementById('SandPBlock').style.display='none'
      document.getElementById('block5').style.display='none'
      document.getElementById('block6').style.display='none'

      document.getElementById('InfoBlock').style.display='block'
      document.getElementById('block7').style.display='block'
      document.getElementById('block8').style.display='block'
      break;
    default:
      var stage_id = document.getElementById("stage4").innerHTML
      //console.log(section4+":--------: "+stage_id+" 2")
  }

}

/*
*   When a card option is clicked
*/
/*
$(".card").click(function () {
    var inputElement = $(this).find('input[type=radio]').attr('id')
    console.log(inputElement)
    var stage_id = document.getElementById('current_stage').innerHTML
    $(this).find('input[type=radio]').prop('checked', true)
    stepToBackend(inputElement,stage_id)
    filterTest(inputElement);
    // cardCheck(inputElement);
    changeText(inputElement);
});
*/
function clickTheCard(item,option){
  var inputElement = $(item).find('input[type=radio]').attr('id')
    $(item).find('input[type=radio]').prop('checked', true)
    filterTest(inputElement);
    changeText(inputElement,option);
    var stage_id = document.getElementById('current_stage').innerHTML
    stepToBackend(inputElement,stage_id)
}


function stepToBackend(inputElement, stage_id) {
    var http = new XMLHttpRequest();
    http.open("POST", "/catalog", true);
    http.setRequestHeader("Content-type","application/json")
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {

        
        if (!$('#group2').has('div').length) {
          step2 = JSON.parse(http.response)
         // console.log(step2)          
          step2.forEach(card => {
            var newdiv = document.createElement('div')
            newdiv.setAttribute('id',card.option_heading.replace(/\s+/g,'') + '-card')
            newdiv.setAttribute('class','card group2 card-settings')
            newdiv.setAttribute('style','text-align: center; max-width: 204px;')
            newdiv.setAttribute('onclick',"clickTheCard(this,2)")
            var img = document.createElement('img')
            img.setAttribute('class','card-img-top mx-auto mt-1')
            img.setAttribute('src','/img/' + card.option_heading.replace(/\s+/g,'') + '.png')
            img.setAttribute('style','width:5rem; height:5rem;')
            img.setAttribute('alt','Card image cap')
            var button = document.createElement('div')
            button.setAttribute('class','card-body')
            button.setAttribute('role','button')
            var head = document.createElement('h6')
            head.setAttribute('class', 'card-title')
            var label = document.createElement('label')
            var input = document.createElement('input')
            input.setAttribute('id',card.option_heading)
            input.setAttribute('value',card.option_heading)
            input.setAttribute('type','radio')
            input.setAttribute('name','radio2')
            label.setAttribute('for',card.option_heading)
            label.innerHTML = card.option_heading
            $(newdiv).append(img,button)
            $(button).append(head)
            $(head).append(input,label)
            $('#group2').append(newdiv)
          })
        } 
        else {
          /*
          if(step==2){
            getStep3()
            console.log('stage 2 is clicked')

          }
          else{
            console.log('stage 1 is clicked')
          }
         */
        if(step == true){
         // console.log('Only step 2 clicked')
          getStep3()
        }
       
        }
        
      }
    }
    var params = JSON.stringify({ 'stepCard': inputElement, stage_id })
    http.send(params);
}


function getStep3() {

  var stage_id = document.getElementById("stage2").innerHTML
  $('#current_stage').html(stage_id)
  blockController(stage_id)

  var http = new XMLHttpRequest();
    http.open("POST", "/catalog", true);
    http.setRequestHeader("Content-type","application/json")
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        step3 = JSON.parse(http.response)

        select = document.getElementById('envSelect');
        
        step3.forEach(card => { 

          if(card.option_id==1){
           // console.log("The card id is: "+card.option_id+". The card heading is: "+card.option_heading)
            // Append the option to select
            $('#envSelect').append('<option value="'+card.option_heading+'">'+card.option_heading+'</option>');
  
            // Set the select value with new option
            //  $("#envSelect").val(card.option_heading);
  
            // Refresh the selectpicker
             $("#envSelect").selectpicker("refresh");
          }
          
         })

      }}
    var params = JSON.stringify({ stage_id })
    http.send(params);
}

function getStep4() {
  var stage_id = document.getElementById("stage2").innerHTML
  var http = new XMLHttpRequest();
    http.open("POST", "/catalog", true);
    http.setRequestHeader("Content-type","application/json")
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        step4 = JSON.parse(http.response)

        select = document.getElementById('licenceSelect');
        
        step4.forEach(card => { 

          if(card.option_id==2){
           // console.log("The card id is: "+card.option_id+". The card heading is: "+card.option_heading)
            // Append the option to select
            $('#licenceSelect').append('<option value="'+card.option_heading+'">'+card.option_heading+'</option>');
  
            // Set the select value with new option
            //  $("#envSelect").val(card.option_heading);
  
            // Refresh the selectpicker
             $("#licenceSelect").selectpicker("refresh");
          }
          
         })

      }}
    var params = JSON.stringify({ stage_id })
    http.send(params);
}


function getStep5() {
  var stage_id = document.getElementById("stage3").innerHTML
  var http = new XMLHttpRequest();
    http.open("POST", "/catalog", true);
    http.setRequestHeader("Content-type","application/json")
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status === 200) {
        step5 = JSON.parse(http.response)

        select = document.getElementById('tshirtSelect');
        
        step5.forEach(card => { 

          if(card.option_id==1){
           // console.log("The card id is: "+card.option_id+". The card heading is: "+card.option_heading)
            // Append the option to select
            $('#tshirtSelect').append('<option value="'+card.option_heading+'">'+card.option_heading+'</option>');
            //console.log((card.option_heading).match(/\d+/g))
            
            // Set the select value with new option
            //  $("#envSelect").val(card.option_heading);
  
            // Refresh the selectpicker
             $("#tshirtSelect").selectpicker("refresh");
          }
          
         })

      }}
    var params = JSON.stringify({ stage_id })
    http.send(params);
}
function unclickRadio() {
    $("input:radio").prop("checked", false);
}

function clickRadio(inputElement) {
    $("#"+inputElement).prop("checked", true);
}

function makeSelect(element, group){

    $(".card").filter("."+group).filter(".selected").removeClass("selected").addClass("unselected");
    $('.' + group).addClass('unselected')
    //$("input:radio").filter("."+group).prop("checked", false);     
    $("#" + element + "-card").removeClass("unselected").addClass("selected");
    // $("#"+element).prop("checked", true);

}

function filterTest(element) {

    var id = element.replace(/\s+/g,'')
    if ($("#" + id + "-card").hasClass("group1")) {
        makeSelect(id, "group1");
        document.getElementById('block2').style.display='block'
    } else if ( $("#" + id + "-card").hasClass("group2") ) {
        makeSelect(id, "group2");
        step = true
    }

}

var finalText = '';
var inputA = false;
var inputB = false;
function step8Var(item,option,i){
 
  var elementValue = item.value;
  finalText = finalText.concat("\n" +elementValue+"\n");

  changeText(finalText,option)

  if(i==1){
    inputA = true;
  }
  else if(i==2){
    inputB = true;
  }

  
  if(inputA==true && inputB==true){
    document.getElementById('subblock').style.display='block'
  }

 

}
var s3a =false;
var s3b =false;

function envSelected(item, option){
  var stage_id = document.getElementById('current_stage').innerHTML.replace(/\s+/g,'')
  var elementValue = item.value;
  //console.log(elementValue+'=='+stage_id+" : "+option)
  changeText(elementValue,option)

  if (stage_id==section2.replace(/\s+/g,'') && option==1) {
    document.getElementById('block4').style.display='block'
    getStep4()
  }
  else if(stage_id==section2.replace(/\s+/g,'') && option==2){
     var stage_id = document.getElementById("stage3").innerHTML
     $('#current_stage').html(stage_id)
    blockController(stage_id)
    getStep5()
  }
  else if(stage_id==section3.replace(/\s+/g,'') && option==1){
    document.getElementById('block6').style.display='block'
    s3a=true;
    checkInputs()

 }
 else if(stage_id==section3.replace(/\s+/g,'') && option==2){
    s3b=true;
    checkInputs();

}
  else if(stage_id==section4.replace(/\s+/g,'') && option==1){
    document.getElementById('block8').style.display='block'
}
  else{
  //  console.log('step 3/4 error')
  }
 

}

function checkInputs(){

  if(s3a==true && s3b==true){
    var stage_id = document.getElementById("stage4").innerHTML
    $('#current_stage').html(stage_id)
    blockController(stage_id)
    return true
  }
return false

}


/*
*   Update service details
*/
function changeText(element,option, stage_id){
  var stage_id = document.getElementById('current_stage').innerHTML.replace(/\s+/g,'')

   switch(option) {
    case 1:
      
      $('#' + stage_id+'1').html(element)
      break;
    case 2:

      $('#' + stage_id+'2').html(element);
      document.getElementById(stage_id+'2').style.display='block'
      break;
    default:

      $('#' + stage_id)+'1'.html(element)
  }





}

//for step buttons on catalog page
function cycleThroughPages(direction){

  var current_stage = document.getElementById("current_stage").innerHTML

  
  if (current_stage==section1 && direction=="R") {
    var stage = current_stage.replace(/\s+/g,'')+'2';
    var step2Check = document.getElementById(stage).innerHTML
    if(step2Check == ""){
    console.log('Variable "step2Check" is empty.');
  }
  else{
    var stage_id = document.getElementById("stage2").innerHTML
     $('#current_stage').html(stage_id)
     blockController(stage_id)
  }
}

else if (current_stage==section2 && direction=="L") {
    var stage_id = document.getElementById("stage1").innerHTML
    $('#current_stage').html(stage_id)
    blockController(stage_id)
}
else if (current_stage==section2 && direction=="R") {
  var stage = current_stage.replace(/\s+/g,'')+'2';
  var step2Check = document.getElementById(stage).innerHTML
  if(step2Check == ""){
  console.log('Variable "step2Check" is empty.');
}
else{
  var stage_id = document.getElementById("stage3").innerHTML
  $('#current_stage').html(stage_id)
  blockController(stage_id)
} 
}
else if (current_stage==section3 && direction=="L") {
var stage_id = document.getElementById("stage2").innerHTML
 $('#current_stage').html(stage_id)
blockController(stage_id)
}
else if (current_stage==section3 && direction=="R") {
  var stage = current_stage.replace(/\s+/g,'')+'2';
  var step2Check = document.getElementById(stage).innerHTML
  if(step2Check == ""){
  console.log('Variable "step2Check" is empty.');
  }
  else{
    if(checkInputs()==true){
      var stage_id = document.getElementById("stage4").innerHTML
      $('#current_stage').html(stage_id)
      blockController(stage_id)
    }
  
  } 
}
else if (current_stage==section4 && direction=="L") {
var stage_id = document.getElementById("stage3").innerHTML
 $('#current_stage').html(stage_id)
blockController(stage_id)
}
}