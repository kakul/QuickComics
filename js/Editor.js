var imageList=[];
var pageList=[];
var currentClickNum;
var Project={};
PageContainer={
	insert:function(item,index){

		if (index==undefined)
			pageList.push(item);
		else
			pageList.splice(index,0,item);
	},

	getPage:function(page){
		for(var i=0;i<pageList.length;i++){
			if(pageList[i].id==page)
				return(pageList[i]);
		}
	},

	insertImage:function(images,imageId){
		
		for(var i=0;i<images.length;i++){
			if(images[i].id==imageId){
				return;
			}
		}
		images.push({id:imageId,start:1,stop:1,animation:[]});
		
	},

	getImage:function(images,imageId){

		for(var i=0;i<images.length;i++){
			
			if(images[i].id==imageId){
				
				return images[i];
			}
		}
	},

	updateAnimationList: function(image,state){
		var j=0;
		for(var i=0;i<image.animation.length;i++){
			if('state'+state==image.animation[i].name){
				
				j=i;
				break;
			}
		}
        var k=j+2;
      
		for(var i=j+1;i<image.animation.length;i++){
			
			image.animation[i].name='state'+k;
			k++;
		}
	},

	deleteState: function(image,name){
		var j;
		

		for(var i=0;i<image.animation.length;i++){
			if(name==image.animation[i].name){
				image.animation.splice(i,1);
				j=i;
				break;
				
			}

		}

		for(var i=j;i<image.animation.length;i++){
			image.animation[i].name='state'+(i+1);
		}
		
	}


	
}

ClickContainer={
	insert:function(page,item,index){
            
       	if (index==undefined)
        	page.clickList.push(item);
       	else
		   	page.clickList.splice(index,0,item);
	},

	addImage: function(page,name,item){
       
		for(var i=0;i<page.clickList.length;i++){
			if(page.clickList[i].id==name){
				var flag=0;
				for(var j=0;j<page.clickList[i].image.length;j++){
					
					if(item.id==page.clickList[i].image[j].id){
							flag=1;
							return;
					}
			    }
			    if(flag==0){

			     page.clickList[i].image.push(item);
			     return;
			    }
			
			}
		}
    
	},

	setStopState: function(page,obj){
		outer:for(var i=0;i<page.clickList.length;i++){
				if(page.clickList[i].id==obj.click){
					
					for(var j=0;j<page.clickList[i].image.length;j++){
						if(page.clickList[i].image[j].id==obj.image){
							
							page.clickList[i].image[j].stop=obj.state;
							break outer;
						}
					
					}
				}
		}

	},
	
	getClick: function(page,click){
		
		for(var i=0;i<page.clickList.length;i++){
			if(page.clickList[i].id==click){
				return page.clickList[i];
			}
		}

	},

	getImage:function(imageArr,image){
		for(var i=0;i<imageArr.length;i++){
			if(imageArr[i].id==image){
				return imageArr[i];

			}
		}
	}
}

ImageContainer={

	getImagesFromPage: function(name){
		
		var images=$(name).find('img');
		for(var i=0;i<images.length;i++){
			var flag=0;
			for(var j=0;j<imageList.length;j++){
				if(images[i].id==imageList[j].id){
					flag=1;
					break;
									}
			}
			if(flag==0){
				var image=new Image();
				image.src=$('#'+images[i].id).attr('src');
				imageList.push({id:images[i].id,previewState:1,state:1,style:{top:0,left:0,opacity:1},animation:[],originalWidth:image.width,originalHeight:image.height});
			}
		}
	},

	removeImagesFromPage: function(name){

		var images=$(name).find('img');
      	for (var i=0;i<imageList.length;i++){
            var flag=0;
            for(var j=0;j<images.length;j++){
                if(images[j].id==imageList[i].id){
                   	flag=1;
                	break;
                }
            }
            if(flag==0){
	           	imageList.splice(i,1);
            }
        }
  	},

    searchImage: function(name){

    	for (var i=0;i<imageList.length;i++){
    		if(name == imageList[i].id){
    			return imageList[i];
    		}
    	}
    },

    setInitialStyle: function(name,obj){
	
		for (var i = 0; i < image.animation.length; i++)
			if(name== image.animation[i].name)
				return image.animation[i];
	},

	previewAnimation: function(image,name){
		
		for (var i = 0; i < image.animation.length; i++)
			if(name== image.animation[i].name)
				return image.animation[i];
	}

	
}


var currentPosition={top:0,left:0};


function setStartAndStopState(image,state,click){
	
	var flag=0;
	for(var i=0;i<pageList.length;i++){
		var clicks=pageList[i].clickList;
		for(var j=0;j<clicks.length;j++){
			var images=clicks[j].image;
			for(var k=0;k<images.length;k++){
				
				if(images[k].id==image){
					
					if(images[k].stop==state && clicks[j].id==click){
					        
                    		flag=1;
		               	
		                	images[k].stop++;
		             		
                    continue;
                    }
					if(flag==1){
                          
							images[k].start++;
							images[k].stop++;
						
					}
				}

			}

		}
	}
}


function getCurrentSelected(){
	
	var currentImage;
	var currentState;
	var currentStateTree;
	var currentClick;
	var currentPage;

	if($('.selected').hasClass('pageName'))
		currentPage=$('.selected').parent();


    
	if($('.selected').hasClass('clickName')){
		
		currentClick=$('.selected').parent();
			
		currentPage=$('.selected').parent().parent().parent();
	}

	if($('.selected').parent().hasClass('clickImage')){
	    currentClick=$('.selected').parent().parent().parent();
		currentImage=ImageContainer.searchImage($('.selected').parent().attr('id'));
	    currentState=undefined;
	    currentStateTree=$('.selected').parent().find('ul');
	    currentPage=$('.selected').parent().parent().parent().parent().parent();
	}
	else if($('.selected').hasClass('stateElement')){
		currentClick=$('.selected').parent().parent().parent().parent();
		currentState=$('.selected');
		currentImage=ImageContainer.searchImage(currentState.parent().parent().attr('id'));
		currentStateTree=currentState.parent();
		currentPage=$('.selected').parent().parent().parent().parent().parent().parent();
	}

	
	return {page:currentPage,click:currentClick,state:currentState,image:currentImage,stateTree:currentStateTree};

}

function updateState(click,image,state){
	var imageToBeModified=findImage(click,image,state);
	
	imageToBeModified.currentImage.stop--;
    
	modifySubsequentImages(imageToBeModified.currentClickNumber,click,image,state);

}
function modifySubsequentImages (currentClickNumber,click,image,state) {
	
	for(var i=(currentClickNumber+1);i<click.length;i++){
		for(var j=0;j<click[i].image.length;j++){
			if(click[i].image[j].id==image){
				click[i].image[j].start--;
				click[i].image[j].stop--;
			}
		}
	}
}

function findImage(click,image,state){
	for(var i=0;i<click.length;i++){
		for(var j=0;j<click[i].image.length;j++){
			if(click[i].image[j].id==image){
				
				if(state>=click[i].image[j].start&&state<click[i].image[j].stop){
					
					return {currentClickNumber:i,currentImage:click[i].image[j]};
				}
			}
		}
	}
}

function getState(image,state){
    
	for(var i=0;i<image.animation.length;i++){
		if(image.animation[i].name==state){
			if(image.animation[i].top==undefined||image.animation[i].left==undefined||image.animation[i].opacity==undefined){
				return;
			}

			return image.animation[i];

		}
	}
    
    return undefined;
}

function setState(animation,state,obj){

    var flag=0;
  
    for(var i=0;i<animation.length;i++){
		if(animation[i].name==state){
			animation[i]=obj;
			flag=1;
	     }
	}
	
	if(flag==0){

	var stateNum=state.substr(5,state.length);
	animation[stateNum-1]=obj;



	}
	

}


function renderState(){
	
	var currentElement=getCurrentSelected();
	var stateNumber=currentElement.state.attr('id');
	var page=PageContainer.getPage(currentElement.page.attr('id'));
	var click=currentElement.click.attr('id');
	var image=currentElement.image.id;
    var pageImage=PageContainer.getImage(page.pageImages,image);
   
	var viewState=getState(pageImage,currentElement.state.attr('id'));
    if(viewState!=undefined){
		$('#topPos').val(viewState.top);
		$('#leftPos').val(viewState.left);
		$('#transparency').val(viewState.opacity);
		$('#duration').val(viewState.duration/1000);
        $('#delayDuration').val(viewState.delay/1000);
        $('#width').val(viewState.width);
        $('#height').val(viewState.height);
    }
    $('#imageDetails').text("Page:"+page.id.substr(4,page.id.length)+" Click:"+click.substr(5,click.length)+" Image: "+image+" State:"+stateNumber.substr(5,stateNumber.length));
}


function setAnimation(){
    
    var selected=getCurrentSelected();
    if(selected.state==undefined){
    	return;
    }
    var page=PageContainer.getPage(selected.page.attr('id'));
    var click=ClickContainer.getClick(page,selected.click.attr('id'));
    var image=ClickContainer.getImage(click.image,selected.image.id);
    var pageImage=PageContainer.getImage(page.pageImages,selected.image.id);

    var stateNumber=selected.state.attr('id');
    
   	$('#topPos').val(currentPosition.top);
	$('#leftPos').val(currentPosition.left);

	var x=parseInt(currentPosition.left,10);
	var y=parseInt(currentPosition.top,10);
    var op=parseFloat($('#transparency').val(),10);
    var ht=parseInt($('#height').val(),10);
    var wt=parseInt($('#width').val(),10);

    stateNumber=stateNumber.substr(5,stateNumber.length);
    if(stateNumber==1){
    	selected.image.style={top:y,left:x,opacity:op};
    }
 	
	setState(pageImage.animation,'state'+stateNumber,{name:'state'+stateNumber,top:y,left:x,opacity:$('#transparency').val(),duration:parseFloat($('#duration').val(),10)*1000,delay:parseFloat($('#delayDuration').val(),10)*1000,width:wt,height:ht});
}

function animateOneImage(image,start,stop,current){
	
	if(current==stop)
		return;
	if(image==undefined)
		return;
    var selected=getCurrentSelected();

   	var pageImage=PageContainer.getImage(PageContainer.getPage(selected.page.attr('id')).pageImages,image.id);
	var transition,time,delayTime;
	transition=getState(pageImage,'state'+current);
	if(transition==undefined){
		alert("Image : "+image.id+" State : "+current+" not defined");
		return;
	}

	if(current == 1){
		$('#'+selected.page.attr('id')+' img[id="'+image.id+'"]').css({top:transition.top,left:transition.left,opacity:transition.opacity,width:transition.width,height:transition.height});
	}
    
	time=transition.duration;
	delayTime=transition.delay;

	$('#'+selected.page.attr('id')+' img[id="'+image.id+'"]').velocity(transition,{delay:delayTime,duration:time,complete: function(){if(current<stop) animateOneImage(image,start,stop,current);}});
	current++;
}

function resetOneImage(image,current){
	var selected=getCurrentSelected();
    var pageImage=PageContainer.getImage(PageContainer.getPage(selected.page.attr('id')).pageImages,image.id);
	var transition=getState(pageImage,'state'+current);
	if(transition==undefined){
		return;
	}
	$('#'+selected.page.attr('id')+' img[id="'+image.id+'"]').css({top:transition.top,left:transition.left,opacity:transition.opacity,width:transition.width,height:transition.height});
}
function revAnimateAll(click){
	var imagesInClick=click.image;
	for(var i=0;i<imagesInClick.length;i++){
		var imageToBeAnimated=ImageContainer.searchImage(imagesInClick[i].id);

		if(imageToBeAnimated.animation==undefined)
			continue;
		else{
			resetOneImage(imageToBeAnimated,click.image[i].start);
		}
	}
}
function animateAll(click){

	var imagesInClick=click.image;
	
	for(var i=0;i<imagesInClick.length;i++){
		var imageToBeAnimated=ImageContainer.searchImage(click.image[i].id);
		
		if(imageToBeAnimated.animation==undefined)
			continue;
		else{
			animateOneImage(imageToBeAnimated,click.image[i].start,click.image[i].stop,click.image[i].start);
		}

	}
}
function showSelectedPage(){
    
	var selected=getCurrentSelected();
	
	if(selected.page==undefined){
		return;
	}
	 if($('div[id="'+selected.page.attr('id')+'"]').css('display')=='none'){
    	$('.page').hide();
    	$('div[id="'+selected.page.attr('id')+'"]').show();
    }
}

function unselectAll(){

	$('.stateElement').removeClass('selected');
    $('.imageName').removeClass('selected');
	$('.clickName').removeClass('selected');
	$('.pageName').removeClass('selected');

}

function animatePage(){
	var selected=getCurrentSelected();
	var page=PageContainer.getPage(selected.page.attr('id'));
	var click=ClickContainer.getClick(page,'click'+currentClickNum);
	if(currentClickNum<page.clickNum)
	{animateAll(click);
	currentClickNum++;}
}

function revAnimatePage(){
	var selected=getCurrentSelected();
	var page=PageContainer.getPage(selected.page.attr('id'));
	
	if(currentClickNum>1){
		currentClickNum--;
		var click=ClickContainer.getClick(page,'click'+currentClickNum);
		revAnimateAll(click);
	}

}

function renderProject(){
	if(Project!=undefined){

		imageList=Project.imageList;
		pageList=Project.pageList;
		fileList=$('#fileList').html(Project.tree);
		var pages=$(Project.pages);
		var images=pages.find('img');
		var imageUrls=Project.imageUrls;
        for(var i=0;i<imageUrls.length;i++){
        	$(images[i]).attr('src',imageUrls[i]);
        }

		$('#pageContainer').html($(pages));
		$('.ui-draggable').show();
		$('.pageImg').css({'z-index':0});

	}
}

function saveProject(name){
	Project.imageList=imageList;
	Project.pageList=pageList;
	Project.tree=$('#fileList').prop('innerHTML');
	Project.imageUrls=[];
	var pages=$('#pageContainer').clone();
	var images=pages.find('img');
	for(var i=0;i<images.length;i++){
		Project.imageUrls.push($(images[i]).attr('src'));
		$(images[i]).attr('src','');
	}
	Project.pages=pages.prop('innerHTML');
	Project.id=name;

}

function displayListOfProjects (obj) {
	$('.projectList').html(obj.responseText);
}
function updateStateTree(page,image,state){
	var flag=0;
	var stateName=state;
	
	var clicks=$(page).children('ul').children('li[class="clickElement"]');
	for(var j=0;j<clicks.length;j++){
		var images=$(clicks[j]).children('ul').children('li[class="clickImage"]');
		for(var k=0;k<images.length;k++){

			if($(images[k]).attr('id')==image){
				var states=$(images[k]).children('ul').children('li[class^="stateElement"]');
				for(var l=0;l<states.length;l++){
					if($(states[l]).attr('id')=='state'+state){
						flag=1;
					}
					if(flag==1 && $(states[l]).attr('id')!='state'+state){
						$(states[l]).attr('id','state'+stateName);
						$(states[l]).text('State '+stateName);
						$(states[l]).append('<span class="deleteState"></span>');
						
							stateName++;
					}
				}
			}
		}
	}

}

function countStates(images,imageID){
	var count=0;
	
	for(var i=0;i<images.length;i++){
		if(images[i].id==imageID){
			return images[i].animation.length;
		}
	}
}
function incrementStateNumber(page,image,state){
	var flag=0;
	var stateName=state;
	var clicks=page.children('ul').children('li[class="clickElement"]');
	for(var j=0;j<clicks.length;j++){
		var images=$(clicks[j]).children('ul').children('li[class="clickImage"]');
		for(var k=0;k<images.length;k++){

			if($(images[k]).attr('id')==image){
				var states=$(images[k]).children('ul').children('li[class^="stateElement"]');
				for(var l=0;l<states.length;l++){
					
					if(flag == 0 && $(states[l]).attr('id') == 'state' + state){
						flag=1;
						continue;
					}
					if(flag == 1 && $(states[l]).attr('id') == 'state' + stateName){

						stateName++;
						$(states[l]).attr('id','state'+stateName);
						$(states[l]).text('State '+stateName);
						$(states[l]).append('<span class="deleteState"></span>');
						
							
					}
				}
			}
		}
	}


}

function decrementStateNumber(page,click,image){
	
	var flag=0;
	var prevName=image.stop;
	var newName=image.start;
	var clicks=page.children('ul').children('li[class="clickElement"]');
	var clickNum=click.substr(5,click.length);
	
	for(var j=clickNum;j<clicks.length;j++){
		var images=$(clicks[j]).children('ul').children('li[class="clickImage"]');
		for(var k=0;k<images.length;k++){
			if($(images[k]).attr('id')==image.id){
			
				var states=$(images[k]).children('ul').children('li[class^="stateElement"]');
				for(var l=0;l<states.length;l++){
					
					if(flag == 0 && $(states[l]).attr('id') == 'state' + image.stop){

						flag=1;
						
					}
					if(flag == 1 && $(states[l]).attr('id') == 'state' + prevName){

						prevName++;
						$(states[l]).attr('id','state'+newName);
						$(states[l]).text('State '+newName);
						$(states[l]).append('<span class="deleteState"></span>');
						newName++;
							
					}
				}
			}
		}
	}


}


function deleteImageFromClick(page,clickId,imageId){
	
	
	var difference;
	var clickToSplice;
	var index;
	
	for(var j=0;j<page.clickList.length;j++){
		var click=page.clickList[j];
		for(var k=0;k<click.image.length;k++){
			var image=click.image[k];
			if(image.id==imageId && click.id==clickId){
				
				difference=image.stop-image.start;
				clickToSplice=click;
				index=k;

			}
			if(difference!=undefined && image.id==imageId){
				
				image.start-=difference;
				image.stop-=difference;
				
			}
		}
	}

	clickToSplice.image.splice(index,1);
}


function deleteImageFromTree(pageId,image){

var start=image.start;	
var states=$('li[id="'+pageId+'"]').find('li[id="'+image.id+'"]').find('li[class="stateElement"]');
	
for(var i=image.stop-1;i<states.length;i++){
	

	$(states[i]).attr('id','state'+start);
	$(states[i]).text('State '+start);
	$(states[i]).append('<span class="deleteState"></span>');
	start++;
}

for(var i=image.start-1;i<=image.stop-2;i++){
	$(states[i]).remove();
}
	
}

function updateClicks(clicks,clickID){
	var flag=0;
	var clickName=clickID;
	for(var i=0;i<clicks.length;i++){
		if(clicks[i].id=='click'+clickID){
			flag=1;
			continue;
		}
		if(flag==1){
			
			clicks[i].id='click'+clickName;
			clickName++;
		}

	}
}
function reOrderClicks(pageID,clickID){
	var flag=0;
	var clickName=clickID;
	var clicks=$('li[id="'+pageID+'"]').find('li[class^="clickElement"]');
	
	for(var i=0; i<clicks.length;i++){
		if($(clicks[i]).attr('id')=='click'+clickID){
			flag=1;
			continue;
		}
		if(flag==1){
			
			$(clicks[i]).attr('id','click'+clickName);
			$(clicks[i]).find('p[class^="clickName"]').text('Click '+clickName);
			$(clicks[i]).find('p[class^="clickName"]').append('<span class="playClick"></span><span class="deleteClick"></span>');
			$(clicks[i]).find('p[class^="clickName"]').prepend('<input type="checkbox" class="check">');
			clickName++;
		}
	}
} 

function deletePageFromList(pageID){
	var flag=0;

	var pageName=pageID.substr(4,pageID.length);
	for (var i=0;i<pageList.length;i++){
		if(pageList[i].id==pageID){
			flag=1;
			continue;
		}
		if(flag==1){
		pageList[i].id='page'+pageName;
		pageName++;
		}
	}
}

function deletePageFromTree(page){
	var flag=0;
	var pageName=page.attr('id');
	pageName=pageName.substr(4,pageName.length);
	var newPageName=pageName;
	var pages=$('.pageElement');
	var pageDisp=$('.page');
	for(var i=0;i<pages.length;i++){
		if($(pages[i]).attr('id')=='page'+pageName && $(pageDisp[i]).attr('id')=='page'+pageName){
			flag=1;
			$(pageDisp[i]).attr('id','pageToBeRemoved');
			continue;
			
		}
		if(flag==1){
			
			$(pageDisp[i]).attr('id','page'+newPageName);
			$(pages[i]).attr('id','page'+newPageName);
			$(pages[i]).find('p[class^="pageName"]').text('Page '+newPageName);
			$(pages[i]).find('p[class^="pageName"]').append('<span class="deletePage"></span>');
			$(pages[i]).find('p[class^="pageName"]').prepend('<input type="checkbox" class="check">');
			newPageName++;
		}

	}
}


function deleteStatesFromPage(pageImage,start,stop){
	var flag=0;
	var diff=stop-start;
	for(var i=stop-1;i<pageImage.animation.length;i++){
		var state=pageImage.animation[i];

		state.name='state'+start;
		
		start++;
	}
	pageImage.animation.splice(start-1,diff);
	pageImage.stop=pageImage.stop-diff;

}
$(document).ready(function(){
    
	
	var pageNum=pageList.length;
	$('.page').hide();
	$('#page').hide();
	
	var multiplicationFactor=$(window).width()-1007;
	$('#fileList').css({width:parseInt(multiplicationFactor*170/342+169,10)});
	$('#navBar').css({width:parseInt(multiplicationFactor*170/342+169,10)});
	$('#upload').css({width:parseInt(multiplicationFactor*85/342+60,10)});
	$('#treeView').css({width:parseInt(multiplicationFactor*85/342+60,10)});
	$('#tools').css({'margin-left':$('#navBar').width()+663,'width':multiplicationFactor*170/342+170});
	$('#page,#pageContainer').css({'margin-left':$('#navBar').width()+10});
	
	$('body').on('mousemove','.page',function(){
		
		var selected=getCurrentSelected();
	   	if(selected.image!=undefined){

			currentPosition = $('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').position();
			$('#currentPos').html("X: "+parseInt(currentPosition.left,10)+" Y: "+parseInt(currentPosition.top,10));
			
		}
	});
});

$('body').on('click','.prevImg',function(){
	$('.prevImg').removeClass('frameSelected');
	$('.tileImg').removeClass('imgSelected');
	$(this).addClass('frameSelected');
	$(this).children('img').addClass('imgSelected');
});

$('.setState').click(function(){
	setAnimation();
});

$('.reset').click(function(){
	clearAnimation();
});


$('body').on('click','.playClick',function(){
    	
    unselectAll();
	$(this).parent().addClass('selected');
	var selected=getCurrentSelected();
	showSelectedPage();
	var page=PageContainer.getPage(selected.page.attr('id'));
	var click=ClickContainer.getClick(page,selected.click.attr('id'));
	animateAll(click);
});

$('body').on('click','.addClick',function(){
    
    unselectAll();
    var current=$(this).parent().parent().attr('id');
    var page=PageContainer.getPage(current);
  	
    
    ClickContainer.insert(page,{id:'click'+page.clickNum,image:[]});
	$(this).before('<li class="clickElement" id="click'+page.clickNum+'"><p class="clickName selected"><input type="checkbox" class="check">Click '+page.clickNum+'<span class="playClick"></span><span class="deleteClick"></span></p><ul class="imageTree"><li class="addFile">Add Images</li> </ul></li>');
	showSelectedPage();  
    page.clickNum++;
     	
        
});

$('body').on("click",'.check',function(){
	if($(this).is(":checked"))
		$(this).parent().parent().find('ul').hide();
	else
		$(this).parent().parent().find('ul').show();

});


$('body').on("click",'.addFile',function(){

	unselectAll();
	$(this).parent().parent().find('p[class="clickName"]').addClass('selected');
	$('#unclickable').fadeIn();
	$('.prevImg').remove();
    
    ImageContainer.getImagesFromPage('#page');
   	for(var i=0;i<imageList.length;i++){   
        	
		$('#imageTile').append('<li class="tileElement"><div class="prevImg" id="tile'+i+'"></div></li>');
		$('#tile'+i).append($('#'+imageList[i].id).clone().addClass("tileImg").css({top:0,left:0,opacity:1,outline:"0px solid",display:"initial"}));
		$('#tile'+i).append($('<div class="tileName">'+imageList[i].id+'</div>'));
	}
      
});

$('body').on('click','#closePreview',function(){

	$('#unclickable').fadeOut();
    $('.prevImg').removeClass('frameSelected');
    $('.tileImg').removeClass('imgSelected');
});

$('body').on('click','#addToTree',function(){
   	var selected=getCurrentSelected();
	var imgTree=selected.click.children('ul');

	
 
    var selectedImages=$('.imgSelected');
    if(selectedImages.length!=0)
	for(var i=0;i<selectedImages.length;i++){
		
        var imageId=$(selectedImages[i]).attr('id');
		var imagePresent=imgTree.children('li[id="'+imageId+'"]').length;

		if(imagePresent==0)
		{   unselectAll();
			imgTree.children('li[class="addFile"]').before('<li id="'+imageId+'" class="clickImage"><p class="imageName selected"><input type="checkbox" class="check">'+imageId+'<span class="deleteImage"></span></p><ul class="stateTree"><li class="addState">Add State</li></ul></li>');
		

		var selected=getCurrentSelected();
		var page=PageContainer.getPage(selected.page.attr('id'));
		var pageImage=PageContainer.getImage(page.pageImages,selected.image.id);
    	var imageArr=ClickContainer.getClick(page,selected.click.attr('id')).image;
      
    	if($('#'+selected.page.attr('id')+' img[id="'+imageId+'"]').length==0){
            
	    	$('div[id="'+selected.page.attr('id')+'"]').append($('#page img[id="'+imageId+'"]').clone());
	    	
	    	
	    }

	    	$('.pageImg').css({outline:"0px solid",'z-index':0});
	    	$('#'+selected.page.attr('id')+' img[id="'+imageId+'"]').css({outline:"2px solid #00FF00",'z-index':2,display:'initial'});
	    	$('.pageImg').draggable({containment:"parent"});
	    	$('.pageImg').draggable("disable");
	    	$('#'+selected.page.attr('id')+' img[id="'+imageId+'"]').draggable({containment:"parent"});
	    	$('#'+selected.page.attr('id')+' img[id="'+imageId+'"]').draggable("enable");
        var startState=1;
        var stateOneClick=$('li[id="'+selected.page.attr('id')+'"]').find('li[id="'+imageId+'"]').find('li[id="state1"]').parent().parent().parent().parent().attr('id');
       
        if(stateOneClick){
        		stateOneClick=stateOneClick.substr(5,stateOneClick.length);
        }
        var currentClick=selected.click.attr('id').substr(5,selected.click.attr('id').length);	
        
        if(pageImage!=undefined){
        
        	if(stateOneClick<currentClick){
        		startState=pageImage.stop;
        	}
        }
    	
       
    	ClickContainer.addImage(page,selected.click.attr('id'),{id:selected.image.id,start:startState,stop:startState});
    	PageContainer.insertImage(page.pageImages,selected.image.id);

    	}
    	else{
    		return;
    	}
	}

});

$('body').on('click','.addState',function(){
    
	
	
 	unselectAll();
 	var flag=0;
    var currentStateTree=$(this).parent().find('li[class="stateElement"]');
    var currentImageID=$(this).parent().parent().attr('id');
   	var currentImage=ImageContainer.searchImage(currentImageID);
   	var selectedPage=$(this).parent().parent().parent().parent().parent().parent();
   	var currentPage=PageContainer.getPage(selectedPage.attr('id'));
   	var pageImage=PageContainer.getImage(currentPage.pageImages,currentImage.id);
    var currentClickId=$(this).parent().parent().parent().parent().attr('id');
   	if(currentStateTree.length==0){

   		var stateOneClick=$('li[id="'+currentPage.id+'"]').find('li[id="'+currentImageID+'"]').find('li[id="state1"]').parent().parent().parent().parent().attr('id');

   		if(stateOneClick){
   			stateOneClick=stateOneClick.substr(5,stateOneClick.length);
   		}
   		currentClickId=currentClickId.substr(5,currentClickId.length);

   		var stateNum;
   		if(stateOneClick){
   			if(currentClickId<stateOneClick){
   				stateNum=1;}
   		}
   		 if(stateNum==undefined){

   			stateNum=countStates(currentPage.pageImages,currentImageID);
   	   		stateNum++;
   		}
      
   		$(this).before('<li id="state'+stateNum+'" class="stateElement">State '+stateNum+'<span class="deleteState"></span>');
	    $(this).parent().find('li[id="state'+stateNum+'"]').addClass('selected');
	    var selected=getCurrentSelected();
	    var setClick=selected.click.attr('id');
	    if(stateNum==1){
	    	pageImage.start=1;
	    }

	    pageImage.animation.splice((stateNum-1),0,{name:'state'+stateNum});
	    
	    showSelectedPage();
	    pageImage.stop=pageImage.stop+1;
	    
	    
	   	
	   	setStartAndStopState(currentImage.id,stateNum,setClick);
		
		incrementStateNumber(selectedPage,currentImage.id,stateNum);
		
		$('#width').val(selected.image.originalWidth);
		$('#height').val(selected.image.originalHeight);


	}

	else if(currentStateTree.length!=0){
		
		var stateNumber=$(currentStateTree[currentStateTree.length-1]).attr('id');
		stateNumber=stateNumber.substr(5,stateNumber.length);
		stateNumber++;

		
		
        
		var stateNum=countStates(currentPage.pageImages,currentImage.id)+1;
		
			
		$(this).before('<li id="state'+stateNumber+'" class="stateElement">State '+stateNumber+'<span class="deleteState"></span>');
		$(this).parent().find('li[id="state'+stateNumber+'"]').addClass('selected');
		
		pageImage.animation.splice((stateNumber-1),0,{name:'state'+stateNumber});
		
		PageContainer.updateAnimationList(pageImage,stateNumber);
		pageImage.stop=pageImage.stop+1;
		
		var selectedClick=getCurrentSelected().click.attr('id');
				
		ClickContainer.setStopState(currentPage,{click:selectedClick,image:currentImage.id,state:stateNumber});
		setStartAndStopState(currentImage.id,stateNumber,selectedClick);
		
		incrementStateNumber(selectedPage,currentImage.id,stateNumber);
        
	}


});
$('body').on('click','.page',function(){
	unselectAll();
	$('.pageImg').css({outline:"0px solid",'z-index':0});
	$('.pageImg').draggable();
	$('.pageImg').draggable("disable");

});

$('body').on('click','.clickName',function(){
	unselectAll();
	$(this).addClass('selected');
	showSelectedPage();
});

$('body').on('click','.pageName',function(){
	unselectAll();

	$(this).addClass('selected');
	showSelectedPage();

});

$('body').on('click','.imageName',function(){
	unselectAll();
	$(this).addClass('selected');
	var selected=getCurrentSelected();
	if(selected.image==undefined){
		return;
	}
	$('.pageImg').css({outline:"0px solid",'z-index':0,opacity:1});
	$('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').css({outline:"2px solid #00FF00",'z-index':1,display:'initial'});
    $('.pageImg').draggable({containment:"parent"});
    $('.pageImg').draggable("disable");
    $('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').draggable({containment:"parent"});
    $('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').draggable("enable");
    showSelectedPage();
});

$('body').on('click','.addPage',function(){
	var pageNum=pageList.length+1;
	PageContainer.insert({id:'page'+pageNum,clickList:[],clickNum:1,pageImages:[]});
	unselectAll();
	$('.page').hide();
	$('#page').hide();
	$('#pageContainer').append('<div class="page" id="page'+pageNum+'"></div>');
    $('div[id="page'+pageNum+'"]').show();
	


	$(this).before('<li class="pageElement" id="page'+pageNum+'"><p class="pageName selected"><input type="checkbox" class="check">Page '+pageNum+'<span class="deletePage"></span></p><ul class="clickTree"><li class="addClick">Add Click</li></ul></li>');
	showSelectedPage();
});

$('body').on('click','.stateElement',function(){
    unselectAll();
	$(this).addClass('selected');
	var selected=getCurrentSelected();

	if(selected.state!=undefined){
        
		renderState();
		var page=PageContainer.getPage(selected.page.attr('id'));
		var pageImage=PageContainer.getImage(page.pageImages,selected.image.id);
		var state=getState(pageImage,selected.state.attr('id'));
		$('.pageImg').css({outline:"0px solid",'z-index':0});
		if(state==undefined){
			$('#width').val(selected.image.originalWidth);
			$('#height').val(selected.image.originalHeight);
			$('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').css({outline:"2px solid #00FF00",opacity:1,'z-index':1,display:'initial'});
		}
		else
			$('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').css({outline:"2px solid #00FF00",'z-index':1,opacity:1,display:'initial',top:state.top,left:state.left});
	    $('.pageImg').draggable({containment:"parent"});
	    $('.pageImg').draggable("disable");
	    $('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').draggable({containment:"parent"});
	    $('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').draggable("enable");
       showSelectedPage();
    }
     
    

});

$('#upload').click(function(){
	
	$('#fileList').hide();
	$('#container').show();
});



$('#treeView').click(function(){
	
	$('#fileList').show();
	$('#container').hide();
});

$('#fileupload').bind('fileuploadalways',function(e,data){ImageContainer.getImagesFromPage('#page');});
$('#fileupload').bind('fileuploaddestroyed',function(e,data){
	ImageContainer.removeImagesFromPage('#page');
	for(var i=0;i<pageList.length;i++){
		ImageContainer.removeImagesFromPage(pageList[i].id);

	}
});

$(window).resize(function(){
var multiplicationFactor=$(window).width()-1007;
$('#fileList,#navBar').css({width:parseInt(multiplicationFactor*170/342+169,10)});
$('#upload,#treeView').css({width:parseInt(multiplicationFactor*85/342+85,10)});
$('#page,#pageContainer,#backAnim').css({'margin-left':$('#navBar').width()+10});
$('#tools').css({'margin-left':$('#navBar').width()+663,'width':multiplicationFactor*170/342+170});
$('#forwAnim').css({'margin-left':$('#navBar').width()+334});
});

$('.previewPage').click(function(){

    var selectedPage=getCurrentSelected().page;
    unselectAll();
    $('#'+selectedPage.attr('id')+' p[class="pageName"]').addClass('selected');

	$('.pageImg').css({outline:"0px solid",'z-index':0});
	if(('.ui-draggable').length==0)
		$('.pageImg').draggable("disable");
	
	currentClickNum=1;
	var btState=$(this).attr('buttonState');

	if(btState==undefined || btState==0){

		$('.pageImg').hide();
        $('#backAnim').show();
		$('#backAnim').css({'margin-left':$('#navBar').width()+10,'z-index':1001});
		$('#forwAnim').show();
		$('#forwAnim').css({'margin-left':$('#navBar').width()+334,'z-index':1001});
		$(this).attr('buttonState',1);
		$(this).text("Stop Preview");
        		
	}
	else{

		$(this).attr('buttonState',0);
		$(this).text("Preview Page");	
		$('#backAnim').hide();
		$('#forwAnim').hide();
		$('#backAnim').css({'margin-left':$('#navBar').width()+10,'z-index':0});
		$('#forwAnim').css({'margin-left':$('#navBar').width()+334,'z-index':0});

		}
});

$('#forwAnim').click(function(){
    $('.pageImg').show();
	animatePage();
});

$('#backAnim').click(function(){
	revAnimatePage();
});

$('#closeSaveProjectManager').click(function(){
	$('#saveProjectManager').hide();
	$('.projectElement').removeClass('selectedProject');
});


$('#closeAddProjectManager').click(function(){
	$('#addProjectManager').hide();
	$('.projectElement').removeClass('selectedProject');
});

$('.loadProjectButton').click(function(){
	$.ajax({type:"GET",url:"scan.php",complete: function(data){displayListOfProjects(data);},cache:false});
    $('#saveProjectManager').hide();
	$('#addProjectManager').show();

});

$('.saveProjectButton').click(function(){
	$.ajax({type:"GET",url:"scan.php",complete: function(data){displayListOfProjects(data);},cache:false});
    $('#addProjectManager').hide();
	$('#saveProjectManager').show();

});

$('#saveProject').click(function(){
	var selected=$('.selectedProject');
	var fileName=$('#projectName').val();
	saveProject(fileName);
	if(fileName.length>0){
		$.ajax({
        type: "POST",
        dataType : 'json',
        url: 'json.php',
        cache:false,
        data:{json:JSON.stringify(Project),folder:fileName},
        success: function () { $.ajax({type:"GET",url:"scan.php",complete: function(data){displayListOfProjects(data);},cache:false});
        	                   alert("Project saved successfully."); },
        error: function() {$.ajax({type:"GET",url:"scan.php",complete: function(data){displayListOfProjects(data);},cache:false});
        						alert("Error occured while saving.");}
    });

	}
});

$('body').on('click','.projectElement',function(){
	
	$('.projectElement').removeClass('selectedProject');
	$(this).addClass('selectedProject');
	if($('.selectedProject').parent().parent().parent().attr('id')=="addProjectManager"){
		$('#projectName').val($('.selectedProject').attr('id'));
	}
});

$('#loadProject').click(function(){
	var selected=$('.selectedProject');
	if($('.selectedProject').length==1){
		var proj=selected.attr('id');
		$.ajax({type:"GET",url:"projects/"+proj+"/project.json",complete: function(data){Project=data.responseJSON;renderProject();},cache:false});
       
	}

});

$('#deleteProject').click(function(){
	var selected=$('.selectedProject');
	if($('.selectedProject').length==1){
		var proj=selected.attr('id');
		$.ajax({type:"POST",
			url:"delete.php",
			data:{folder:proj},
			success: function(){
				$.ajax({
					type:"GET",
					url:"scan.php",
					complete: function(data){
						displayListOfProjects(data);
						alert("Project deleted successfully.");
					},
					cache:false
				});
			},
        	error: function() {
        		$.ajax({
        			type:"GET",
        			url:"scan.php",
        			complete: function(data){
        				displayListOfProjects(data);
        				alert("Error occured while deleting.");
        			},
        			cache:false
        		});
        	}
        });
	}
});

$('body').on('click','.deleteState',function(){
	unselectAll();
	$(this).parent().addClass('selected');
	var selected=getCurrentSelected();
	var state=selected.state.attr('id');
	var page=selected.page;
	updateStateTree(page,selected.image.id,state.substr(5,state.length));
	$('.selected').remove();
	
	var page=PageContainer.getPage(selected.page.attr('id'));
	var pageImage=PageContainer.getImage(page.pageImages,selected.image.id);
	var stateId=selected.state.attr('id');
	pageImage.stop--;
	PageContainer.deleteState(pageImage,stateId);
	updateState(page.clickList,selected.image.id,stateId.substr(5,stateId.length));
	
});

$('body').on('click','.deleteImage',function(){
	unselectAll();
	$(this).parent().addClass('selected');
	var selected=getCurrentSelected();
	var page=PageContainer.getPage(selected.page.attr('id'));
	var click=ClickContainer.getClick(page,selected.click.attr('id'));
	var image=ClickContainer.getImage(click.image,selected.image.id);
	var start=image.start;
	var stop=image.stop;
	var pageImage=PageContainer.getImage(page.pageImages,selected.image.id);
	deleteImageFromTree(page.id,image);
	deleteImageFromClick(page,click.id,image.id);
	deleteStatesFromPage(pageImage,start,stop);
	

    $(this).parent().parent().remove();
     var imageExists=$('li[id="'+selected.page.attr('id')+'"]').find('li[class^="clickImage"]li[id="'+selected.image.id+'"]');
    
    if(imageExists.length==0){
    	$('#'+selected.page.attr('id')+' img[id="'+selected.image.id+'"]').remove();
    }
	
 });


$('body').on('click','.deleteClick',function(){
	unselectAll();
	$(this).parent().addClass('selected');
	var selected=getCurrentSelected();
	var page=PageContainer.getPage(selected.page.attr('id'));
	var click=ClickContainer.getClick(page,selected.click.attr('id'));
	var clickName=click.id.substr(5,click.id.length);
	
	var k=click.image.length;
    for(var j=0;j<k;j++){
        
		var image=click.image[0];
		var start=image.start;
		var stop=image.stop;
	    var pageImage=PageContainer.getImage(page.pageImages,image.id);
		deleteImageFromTree(page.id,image);
		deleteImageFromClick(page,click.id,image.id);
		deleteStatesFromPage(pageImage,start,stop);		
	}
	unselectAll();
	selected.page.find('p[class="pageName"]').addClass('selected');
	
	
	updateClicks(page.clickList,clickName);
	reOrderClicks(page.id,clickName);
	selected.click.remove();
	page.clickList.splice(clickName-1,1);
	page.clickNum--;

	for(var i=0;i<imageList.length;i++){
		var imageExists=$('li[id="'+page.id+'"]').find('li[class^="clickImage"]li[id="'+imageList[i].id+'"]');
		
    	  	if(imageExists.length==0){
    		$('#'+selected.page.attr('id')+' img[id="'+imageList[i].id+'"]').remove();
		}		
	}
});

$('body').on('click','.deletePage',function(){
	unselectAll();
	$(this).parent().addClass('selected');
	var selected=getCurrentSelected();
	var pageNo=selected.page.attr('id');
	pageNo=pageNo.substr(4,page.length);
	deletePageFromList(selected.page.attr('id'));
	deletePageFromTree(selected.page);
	selected.page.remove();
	pageList.splice(pageNo-1,1);
	$('div[id="pageToBeRemoved"]').remove();
});
