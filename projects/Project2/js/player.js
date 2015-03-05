var currentPageNumber=1;
var imageList=[];
var pageList=[];
var currentClickNum=1;
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
	},






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
				imageList.push({id:images[i].id,previewState:1,state:1,style:{top:0,left:0,opacity:1},animation:[]});
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
	},

	deleteState: function(image,name){
		var j;
		var flag=0;
		for(var i=0;i<image.animation.length;i++){
			if(name==image.animation[i].name){
				image.animation.splice(i,1);
				j=i;
				break;
				flag=1;
			}

		}

		for(var i=j;i<image.animation.length;i++){
			image.animation[i].name='state'+(i+1);
		}
		if(flag==1){
			image.state--;
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


function animateOneImage(image,start,stop,current){
	
	if(current==stop)
		return;
	if(image==undefined)
		return;
    

	var transition,time,delayTime;
	transition=ImageContainer.previewAnimation(image,'state'+current);
	if(transition==undefined){
		
		return;
	}

	if(current == start){
		
		$('#page'+currentPageNumber+' img[id="'+image.id+'"]').css({top:transition.top,left:transition.left,opacity:transition.opacity});
	}
    
	time=transition.duration;
	delayTime=transition.delay;
   	$('#page'+currentPageNumber+' img[id="'+image.id+'"]').velocity(transition,{delay:delayTime,duration:time,complete: function(){if(current<stop) animateOneImage(image,start,stop,current);}});
	current++;

}

function resetOneImage(image,current){
	var transition=ImageContainer.previewAnimation(image,'state'+current);
	if(transition==undefined){
		return;
	}
	$('#page'+currentPageNumber+' img[id="'+image.id+'"]').css({top:transition.top,left:transition.left,opacity:transition.opacity});
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
	 if($('div[id="'+selected.page.attr('id')+'"]').css('display')=='none'){
    	$('.page').hide();
    	$('div[id="'+selected.page.attr('id')+'"]').show();
    }
}

function animatePage(pageNum){
	
	if(pageNum==pageList.length){
			
			return;

		}
	var page=PageContainer.getPage('page'+pageNum);
	var click=ClickContainer.getClick(page,'click'+currentClickNum);
	
	if(currentClickNum<page.clickNum)
	{
		animateAll(click);
		currentClickNum++;
		
	}
	else if(currentClickNum==page.clickNum){
		currentPageNumber++;
		currentClickNum=1;
		$('.page').hide()
       	$('#page'+currentPageNumber).show();
		//delete the following two lines for a delay between pages
		page=PageContainer.getPage('page'+currentPageNumber);
		click=ClickContainer.getClick(page,'click'+currentClickNum);
		animateAll(click);
		currentClickNum++;
	}
}

function revAnimatePage(){
	
	if(currentPageNumber==1){
		if(currentClickNum==1){
			
			return;
		}

		
		var page=PageContainer.getPage('page'+currentPageNumber);
	    currentClickNum--;
		var click=ClickContainer.getClick(page,'click'+currentClickNum);
		revAnimateAll(click);

	}
	else {

		var page=PageContainer.getPage('page'+currentPageNumber);
	    if(currentClickNum>1){
			currentClickNum--;
			var click=ClickContainer.getClick(page,'click'+currentClickNum);
			revAnimateAll(click);
			return;
			
		}
		if(currentClickNum==1){
			currentPageNumber--;
			$('.page').hide();
			$('#page'+currentPageNumber).show();
			page=PageContainer.getPage('page'+currentPageNumber);
			var click=ClickContainer.getClick(page,'click'+page.clickList.length);
			currentClickNum=page.clickList.length;
			revAnimateAll(click);
		}
	}
}

function renderProject(){
	if(Project!=undefined){

		imageList=Project.imageList;
		pageList=Project.pageList;
		var pages=$(Project.pages);
		var images=pages.find('img');
		var imageUrls=Project.imageUrls;
        for(var i=0;i<imageUrls.length;i++){
        	console.log($(images[i]).attr('src','img'+imageUrls[i].substr(imageUrls[i].lastIndexOf('/'),imageUrls[i].length)));
        	
        }
		$('#pageContainer').html(pages);
		$('.ui-draggable').hide();
		$('.page').hide();
		$($('.page')[0]).show();
		$('#forwAnim').show();
		$('#backAnim').show();
		$('.pageImg').css({outline:0});
	}
}

$(document).ready(function(){
    
	$('body').css({'background-color':'#333'});
	var pageNum=pageList.length;
	$('.page').hide();
	$('#page').hide();

	
	var multiplicationFactor=$(window).width()-1007;
	
	$('#page,#pageContainer').css({'margin-left':parseInt(multiplicationFactor*170/342+179,10)});
	$('#forwAnim').css({'margin-left':parseInt(multiplicationFactor*172/342+503,10),width:parseInt(504+170*multiplicationFactor/342,10)});
	$('#backAnim').css({'margin-left':'5px',width:parseInt(503+172*multiplicationFactor/342,10)});
	$('body').on('click','#forwAnim',function(){
	
    $('.pageImg').show();

		animatePage(currentPageNumber);
	});

	

	$.ajax({type:"GET",url:'project.json',complete: function(data){Project=data.responseJSON;renderProject();},cache:false});
	
	$('#backAnim').show();


	$('body').on('click','#backAnim',function(){
		revAnimatePage();
});


});


$('body').on('click','.page',function(){
	unselectAll();
	$('.pageImg').css({outline:"0px solid",'z-index':0});
	$('.pageImg').draggable();
	$('.pageImg').draggable("disable");

});



$(window).resize(function(){
var multiplicationFactor=$(window).width()-1007;

$('#page,#pageContainer').css({'margin-left':parseInt(multiplicationFactor*170/342+179,10)});
$('#forwAnim').css({'margin-left':parseInt(multiplicationFactor*172/342+503,10),width:parseInt(504+170*multiplicationFactor/342,10)});
$('#backAnim').css({'margin-left':'5px',width:parseInt(503+172*multiplicationFactor/342,10)});
});