// var script = document.createElement('script');
// script.setAttribute("type","text/javascript"); 
// script.setAttribute("src","../../page/index.js");
// document.body.appendChild(script);


window.onload = function(){
	(function(){
		const DEFAULT_CURRENT_PAGE = 1;
		const DEFAULT_SHOW_NUM = 8;
		const DEFAULT_ITEMS_LIMIT = 15;

		function Pagination(options){
			this.options = options;
			this.current = options.current || DEFAULT_CURRENT_PAGE;
			this.showNum = options.showNum || DEFAULT_SHOW_NUM;
			this.itemsLimit = options.itemsLimit || DEFAULT_ITEMS_LIMIT;
			this.render();
		};
		Pagination.prototype.render = function(){
			this.destroy();
			this.container = _.createElement('ul','m-pagination');
			this.first = _.createElement('li','','第一页');
			this.first.dataset.page = 1;
			this.container.appendChild(this.first);
			this.prev = _.createElement('li','','前一页');
			this.container.appendChild(this.prev);
			this.pageNum = Math.ceil(this.options.total/this.itemsLimit);
			this.startNum = Math.floor((this.current-1)/this.showNum)*this.showNum+1;
			this.numEls = [];
			for(var i=0; i<this.showNum; i++){
				var numEl = _.createElement('li'), num = this.startNum + i;
				if(num<= this.pageNum){
					numEl.innerHTML = num;
					numEl.dataset.page = num;
					this.numEls.push(numEl);
					this.container.appendChild(numEl);
				}
			}
			this.next = _.createElement('li','','下一页');
			this.last = _.createElement('li','','尾页')
			this.last.dataset.page = this.pageNum;
			this.container.appendChild(this.next);
			this.container.appendChild(this.last);

			this.setStatus();
			this.addEvent();
			this.options.parent.appendChild(this.container);
		};
		//初始化样式
		Pagination.prototype.setStatus = function(){
			if(this.current == 1){
				this.first.className = 'disabled';
				this.prev.className = 'disabled';
			}else if(this.current == this.pageNum){
				this.next.className = 'disabled'
				this.last.className = 'disabled'
			}else{
				this.first.className = '';
				this.prev.className = '';
				this.next.className = ''
				this.last.className = ''
			}
			this.prev.dataset.page = this.current-1;
			this.next.dataset.page = this.current+1;
			this.numEls.forEach(function(numEl){
				numEl.className = '';
				if(this.current === parseInt(numEl.dataset.page)){
					numEl.className = 'active';
				}
			}.bind(this));
		};
		// 添加事件代理
		Pagination.prototype.addEvent = function(){
			var clickHandler = function(e){
				var numEl = e.target;
				if(!numEl.classList.contains('disabled') && !numEl.classList.contains('active')){
					this.current = parseInt(numEl.dataset.page);
					if(this.current < this.startNum || this.current>=this.startNum +this.showNum){
						this.render();
					}else{
						this.setStatus();
					}
					this.options.callback(this.current)
				}
			}.bind(this);
			this.container.addEventListener('click',clickHandler);
		};
		Pagination.prototype.destroy = function(){
			if(this.container){
				this.options.parent.removeChild(this.container)
			}
		}
		window.App.Pagination = Pagination;
	})();


	(function(App){
		var page = {
			init: function(){
				this.profile = document.getElementsByClassName('g-profile')[0];
				this.initNav();
				this.initList();
				this.addEvent();
				new App.Pagination({
					parent:document.getElementById('pagination'),
					total:500,
					current:1,
					showNum:8,
					itemsLimit:15,
					callback:function(currentPage){
						this.loadList({
							query:{
								limit:15,
								offset:(currentPage - 1)*15,
								total:0
							},
							callback: function(data){
								this.renderList(data.result.data);
							}.bind(this)
						})
					}.bind(this)
				});
			},
			initNav:function(){
				App.nav.init({
					login:function(user){
						this.initProfile(user);						
					}.bind(this)
				});
				this.slider = new App.Slider({
						index:1, 
						imagesUrl:['../../res/images/banner0.jpg','../../res/images/banner1.jpg','../../res/images/banner2.jpg','../../res/images/banner3.jpg'],
						container:document.getElementsByClassName('g-banner')[0],
						interval:5000							
					})
			},
			initProfile:function(user){
				var html;
				if(!user.id) {
					html = '<button class="u-btn u-btn-primary">请登录</button>'
				}else{
				var sex = iconConfig[user.sex];
				var age = new Date().getFullYear()-parseInt(user.birthday.split('-')[0]);
				var cityOption = [[user.province,2],[user.city,1]];
				var city = this.getCity(ADDRESS_CODES,cityOption);
				var constellation = this.getConstellation(user.birthday);
				   html = `<img src="../../res/images/avatar-big.png" alt="">
										<div class="u-info">
											<em class="name" title="${user.nickname}">${user.nickname}</em>
											<span class="u-icon ${sex}"></span>
										</div>
										<div class="u-info">
											<em class="age">${age}岁</em>
											<em class="corstellation">${constellation}座</em>
											<span class="address-info">
												<em class="u-icon u-icon-address"></em>
												<em class="address">${city}</em>
											</span>
										</div>`
				}
				this.profile.innerHTML = html;
			},
			/*data:城市数组
			 *options:[[省代码，匹配时需要取得数据的下标值],[]]
			 */
			getCity:function(data,options){
				var value = data;
				for(let i=0; i<options.length; i++){
					for(let j=0; j<value.length; j++){
						if(value[j][0]==options[i][0]){
							value = value[j][options[i][1]]
							break;
						}
					}					
				}
				return value;
			},

			//根据生日计算出星座
			getConstellation:function(birthday){
				var birthday = new Date(birthday);
				var month = birthday.getMonth()+1;
				var date = birthday.getDate();
				var constellatons = [
					[12,22,1 ,19,'摩羯'],[1 ,20,2 ,18,'水瓶'],
					[2 ,19,3 ,20,'双鱼'],[3 ,21,4 ,20,'白羊'],
					[4 ,21,5 ,20,'金牛'],[5 ,21,6 ,21,'双子'],
					[6 ,22,7 ,22,'巨蟹'],[7 ,23,8 ,22,'狮子'],
					[8 ,23,9 ,22,'处女'],[9 ,23,10,22,'天秤'],
					[10,23,11,21,'天蝎'],[11,22,12,21,'射手']
				];
				for(let i=0; i<constellatons.length; i++){
					var c = constellatons[i];
					if(month == c[0] && date>=c[1] || month == c[2] && date <= c[3]){
						return c[4];
					}
				}
			},
			// 算法求星座
			getConstellation1:function(birthday){
				var birthday = new Date(birthday);
				var month = birthday.getMonth()+1;
				var date = birthday.getDate();
				var constellatons = ['摩羯','水瓶','双鱼','白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯'];
				return constellatons[month-(date-14<'657778999988'.charAt(month-1))];				
			},
			//获取作品列表数据
			initList: function(){
				this.loadList({
					query:{},
					callback:function(data){
						if(!data.result.data.length){
							_.$('myworks').innerHTML = '你还没有创建过作品~';
							return;
						}
						this.renderList(data.result.data);
					}.bind(this)
				});				
			},
			//获取列表
			loadList: function(options){
				_.ajax({
					url:'/api/works',
					data:options.query,
					success:function(data){
						options.callback(data);
					}
				});
			},
			renderList:function(list){
				// 拼装字符串
				var rawTemplate =`
				{{#each works}}
					<li class="item" data-id="{{this.id}}">
						<a href="#">
							{{#if this.coverUrl}}
							<img src="{{this.coverUrl}}" alt="{{this.name}}">
							{{else}}
							<img src="default_cover.png" alt="作品默认封面">
							{{/if}}
							<h3>{{this.name}}</h3>
						</a>						
						<div class="icons">
							<i class="u-icon u-icon-edit"></i>
							<i class="u-icon u-icon-delete"></i>
						</div>
					</li>
					{{/each}}`;
				var template = Handlebars.compile(rawTemplate);
				var context = {
					"works":list,
				};
				var html = template(context);
				_.$('myworks').innerHTML = html;
			},
			addEvent:function(){
				_.$('myworks').addEventListener('click',function(e){
					var target = e.target;
					if(target.classList.contains('u-icon')){
						var worksEl = target.parentNode.parentNode;
						var options = {
							name: worksEl.getElementsByTagName('h3')[0].innerHTML,
							id: worksEl.dataset.id
						}
						if(target.classList.contains('u-icon-delete')){
							this.deleteWorks(options);
						}else if(target.classList.contains('u-icon-edit')){
							this.editWorks(options,worksEl);
						}
					}
				}.bind(this));
			},
			deleteWorks:function(work){
				var self = this;
				var content = `确定要删除 <i>"${work.name}"</i> 吗`
				var modal = new App.Modal({content:content});
				_.on(modal.modal,'ok',function(){
					_.ajax({
						url:'/api/works/' + work.id,
						method: 'DELETE',
						success: function(data){
							self.initList();
							alert('删除成功')
						}
					})
					modal.hideModal();
				})
			},
			editWorks:function(work,workEl){
				var modal = new App.Modal({
					content:`<input type="text" class="item-name-inp" value="${work.name}"/>`,
					title:'请输入作品名称'
				});
				var input = modal.modal.getElementsByTagName('input')[0];
				_.on(modal.modal,'ok',function(){
					var newName = input.value.trim();
					if(newName !== work.name){
						_.ajax({
							url:'/api/works/' + work.id,
							method: 'PATCH',
							data: {name:newName},
							success: function(data){
								workEl.getElementsByTagName('h3')[0].innerHTML = data.result.name;
								modal.hideModal();
							}
						});
					}
				});
			},
		};

		// 页面初始化
		page.init();

	})(window.App);

}