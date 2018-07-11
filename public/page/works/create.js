(function(){
	App.nav.init()
})();

(function(){
	function Tag(options){
		this.options = options;
		if(!this.options.parent){
			alert('请传入标签父容器');
			return;
		}
		this.tagEls = [];
		this.list = [];
		this.element = _.createElement('ul','m-tag');
		this.recommendEl = _.createElement('ul','m-tag');
		this.options.parent.appendChild(this.element);
		this.options.recommendParent.appendChild(this.recommendEl);
		this.initList();
		this.initRecommend();
		this.addEvent();

	};
	Tag.prototype.initList = function(){
		this.addTag = _.createElement('li','tag tag-add');
		this.addInput = _.createElement('input','u-inp');
		this.addTxt = _.createElement('span','txt','+ 自定义标签');
		this.addTag.appendChild(this.addInput);
		this.addTag.appendChild(this.addTxt);
		this.element.appendChild(this.addTag);
		//初始化时传入的标签
		this.add(this.options.tags);
	};
	Tag.prototype.add = function(tags){
		var add = function(tag){
			if(this.list.includes(tag)){
				return;
			}
			var html = `<li class="tag">
										<button class="close">x</button>
										<span>${tag}</span>
									</li>`;
			var tagEl = _.htmlToNode(html);
			this.element.insertBefore(tagEl,this.addTag);
			this.list.push(tag);
			this.tagEls.push(tagEl);				
		}
		if(tags && !Array.isArray(tags)){
			tags = [tags];
		}
		(tags || []).forEach(add,this);
	};
	Tag.prototype.remove = function(tag){
		for(let i=0;i<this.list.length; i++){
			if(this.list[i] === tag){
				this.element.removeChild(this.tagEls[i]);
				this.list.splice(i,1);
				this.tagEls.splice(i,1);
				break;
			}
		}
	};
	Tag.prototype.addEvent = function(){
		//标签点击事件
		var clickHandler = function(e){


			var target = e.target;
			if(target.tagName === 'BUTTON'){
				var value = target.parentNode.getElementsByTagName('span')[0].textContent;
				this.remove(value);
			}else if(target.textContent === '+ 自定义标签'){
				_.addClassName(this.addTag,'focused')	
				this.addInput.focus()			
			}

		}.bind(this);
		//输入框失焦事件
		var tagInputHandler = function(e){
			this.addInput.value = '';
			this.addTag.classList.remove('focused');
		}.bind(this);
		var tagInputKeyDownHandler = function(e){
			if(e.keyCode === 13){
			console.log(e.keyCode)
				var value = this.addInput.value.trim();
				var tagExist = false;
				for(let i=0; i<this.list.length; i++){
					var tagValue = this.list[i];
					if( tagValue === value){
						tagExist = true;
					}
				}
				if(!tagExist){
					this.add([value]);
					this.addInput.value = '';
				}
			}
		}.bind(this);
		var clickAddTagHandler = function(e){
			if(e.target.tagName === 'LI'){
				var value = e.target.textContent.replace('+','');
				this.add(value);
			}
		}.bind(this);
		this.element.addEventListener('click',clickHandler);
		this.addInput.addEventListener('blur',tagInputHandler);
		this.addInput.addEventListener('keydown',tagInputKeyDownHandler);
		this.recommendEl.addEventListener('click',clickAddTagHandler)
	};
	Tag.prototype.getValue = function(){
		return this.list;
	};
	Tag.prototype.initRecommend = function(){
		_.ajax({
			url:'/api/tags?recommend',
				success:function(data){
				var tags  = data.result.split(',');
				for(let i=0; i<tags.length; i++){
					var html = `<li class="tag tag-1">+${tags[i]}</li>`;
					var recomEl = _.htmlToNode(html);
					this.recommendEl.appendChild(recomEl);
				}
			}.bind(this),
		})
	};

	App.Tag = Tag;
})();

(function(App){
	var page = {
		init:function(){
			this.tag = new App.Tag({
				tags:['玄幻','科技','修仙','大道三千'],
				parent:_.$('tag-contain'),
				recommendParent:_.$('recommend')
			});
		// initFileInput:function(){
			var pictures = [];
			var fileInput = _.$('upload-file');
			var create = _.$('create');
			fileInput.addEventListener('change',changeHandler);
			create.addEventListener('click',createWorksHandler.bind(this))
			//文件处理
			function changeHandler(e){
				var files = e.target.files;
				var sizeExceedFiles = [];
				var sizeOkFiles = [];
				var maxSize = 1024*1024;
				// 判断文件数量是否超出10个
				if(files.length>10){
					alert('每次上传文件最多不得超过10个！');
					return;
				}
				// 判断选择文件大小是否符合要求，
				for(let i=0; i<files.length; i++){
					if(files[i].size < maxSize){
						sizeOkFiles.push(files[i])
					}else{
						sizeExceedFiles.push(files[i])
					}
				}
				//存在文件过大进行提醒
				if(sizeExceedFiles.length>0){
					var name = '';
					for(let i=0; i<sizeExceedFiles.length; i++){
						name += sizeExceedFiles[i].name;
						console.log('name',name)
					}
					alert('每张图片大小不能超过1M:'+name);
					return;
				}
				console.log('files',sizeOkFiles);
				uploadFiles(sizeOkFiles);
			};
			//文件上传
			function uploadFiles(files){
				var progressBar = _.$('fileUploadPro'),
						progressInfo = _.$('progressInfo'),
						totalSize = 0,
						loadedSize = 0,
						uploadingFileIndex = 1,
						showImg = _.$('showImg');
						imgContainer = _.createElement('ul','imgContainer');
						showImg.appendChild(imgContainer);
						console.log(showImg)

				progressBar.parentNode.style.opacity = 1;
				// 设置上进度条总长度
				for(let i=0; i<files.length; i++){
					totalSize += files[i].size;
					console.log(files[i].size)
					console.log(totalSize)
				}
				progressBar.max = totalSize;

				var getLoadedSize = function(data){
					//计算已经上传的长度
					loadedSize = 0;
					for(let i=0; i<uploadingFileIndex-1; i++){
						loadedSize += files[i].size;
					}
					return(loadedSize + data);
				};
				var progressHandler = function(e){
					if(e.lengthComputable){
						console.log(e)
						// 更新processBar value 为getLoadSize
						//设置progressInfo,共x个文件，正在上传y个，进度%
						progressBar.value = getLoadedSize(e.loaded);
						var pecent = Math.round(getLoadedSize(e.loaded)/totalSize*100);
						var text = "共"+files.length+"文件，正在上传"+uploadingFileIndex+"个，进度"+
												pecent+'%';
						progressInfo.textContent =text ;
						if(pecent === 100){
							progressBar.parentNode.style.opacity = 0;
						}
					}
				};
				var readyStateHandler = function(e){
					if(this.readyState === this.DONE){
						console.log('this',JSON.parse(e.target.response))
						var data = JSON.parse(e.target.response).result;
						pictures.push(data);
						console.log('worksInfo',pictures)
						// 将图片更新到图片列表，更新uploadingFileIndex的值
						var html = `<li class="imgItem" data-id="${data.id}">			
													<i class="u-icon u-icon-delete"></i>
													<img src="${data.url}" alt="${data.name}">
													<label>
														<input type="radio" name="cover">
														<span class="setCover">设为封面</span>
														<span class="cancelCover">已设为封面</span>
													</label>
												</li>`;
						var imgNode = _.htmlToNode(html);
						imgNode.addEventListener('click',imgItemClickHandler);
						imgContainer.append(imgNode);

						uploadingFileIndex++;
						upload();
					}
				};
				var upload = function(){
					var file = files[uploadingFileIndex-1]
					if(!file){
						return
					}
					var fd =new FormData();
					fd.append('file',file,file.name);
					var xhr = new XMLHttpRequest();
					xhr.withCredentials = true;
					xhr.addEventListener('readystatechange',readyStateHandler,false);
					xhr.upload.addEventListener('progress',progressHandler,false);
					xhr.open('POST','/api/works?upload');
					xhr.send(fd);
				}
				upload();
			};
			//创建作品
			function createWorksHandler(e){
				e.preventDefault();
				var	name = _.$('workName').value,
						tag = this.tag.getValue().join(),
						category = _.$('original').checked? 0 : 1,
						description = _.$('describe').value,
						privilege,
						authorization;
				// 判定名字是否为空
				if(!name.trim().length>0){
					document.getElementsByClassName('errormsg')[0].style.opacity = 1;
					return;
				}
				// 获取privilege的值
				var inputNodes = document.getElementsByClassName('m-privilege')[0]
												.getElementsByTagName('input');
				for(let i=0; i<inputNodes.length; i++){
					if(inputNodes[i].checked){
						privilege = inputNodes[i].value;
						break;
					}
				}
				var data = {
					name: name,
					tag: tag,
					coverId: this.coverId,
					coverUrl: this.coverUrl,
					pictures: pictures,
					category: category,
					description: description,
					privilege: 1,
					authorization : 0
				};
				_.ajax({
					url:'/api/works',
					method: 'POST',
					data: data,
					success: function(data){
						console.log(data);
						if(data.code ===200){
						window.location.href = '/list'
						}
					}
				}) 
				console.log('category',category,description,tag,privilege,pictures,data)
			};
			var imgItemClickHandler = function(e){
				var target = e.target;
				// 点击为设置封面按键，则设置封面信息
				if(target.classList.contains('setCover')){
					var imgItem = target.parentNode.parentNode;
					var img = imgItem.getElementsByTagName('img')[0];
					this.coverId = imgItem.dataset.id;
					this.coverUrl = img.src;
				}
				// 删除图片
				if(target.classList.contains('u-icon-delete')){

				}
			}.bind(this);
		// }
		},
	};
	page.init();
})(window.App);


(function(){
	function FileInput(argument) {
		
	}
})()
// var upload = document.getElementById('upload-file');
// upload.addEventListener('change',changeHandler);
// function changeHandler(e){
// 	console.log(e);
	
// }.bind(this);

// var xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

// xhr.addEventListener('progess',uploadProgressHandeler,false);
// xhr.upload.addEventListener('progess',downloadProgressHandler,false);