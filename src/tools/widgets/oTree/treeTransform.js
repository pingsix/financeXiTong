		/**
		 * @param ids:string ,source:Array
		 */
		function ids2tree(ids,source){
			if(source){
				var source = JSON.parse(JSON.stringify(source));
			}else{
				console.log('--> no source!');
				return;
			}
			if(typeof ids === 'string'){
				ids = JSON.parse(ids);
				if(!Array.isArray(ids)) return;
			};
			source.forEach(function(v){
				var isPassArr = [];
				v.children.forEach(function(item,index,arr){
					var isPss = ids.some(function(k){
									if(item.id === k){
										return true;
									}else{
										return false;
									}
								})
					if(isPss){
						isPassArr.push(item)
					}
				})
				v.children = isPassArr;
			})
			var newSource = [];
			source.forEach(function(v){
				if(v.children.length){
					newSource.push(v)
				}
			})
			return newSource;
		}
		
		/**
		 * @param {Array} tree
		 */
		function tree2ids(tree){
			var ids = [];
			if(typeof tree === 'string'){
				tree = JSON.parse(tree);
			}
			else{
			}
			//删除父节点id						
			tree.forEach(function(v){
				if(v.id){
					delete v.id;
				}
			})
			getIds(tree);
			function getIds(tree){
				var tree2;
				if(typeof tree === 'string'){
					tree2 = JSON.parse(tree);
				}else{
					tree2 = tree;
				}
				tree2.forEach(function(v){
					if(v.id){
					    if(ids.indexOf(v.id) !== -1) return;
							ids.push(v.id);
					}
					if(v.children && v.children.length){
						v.children.forEach(function(k,index,arr){
							getIds(arr);
						})
					}
				})
			}
			return JSON.stringify(ids);
		}
		
		/**
		 * 扩展ids2tree方法返回的树的属性
		 * @param {Array} treeArr
		 */
		function expansion(treeArr){
			treeArr.forEach(function(k){
						if(!k.href && k.children.length){
							k['id']   = k.id;
							k['text'] = k.text;
							k['icon'] = true;
							k['li_attr'] = k.id;
							k['a_attr']  = { 
												 "href": "#",
												 "id": k.id + "_anchor"
												 };
							k['state'] = { 
												"loaded": true,
									            "opened": true,
									            "selected": false,
									            "disabled": false
												};
							k['data']  = {};
							expansion(k.children);
						};
						
						if(v == k.id){
							k['id']   = k.id;
							k['text'] = k.text;
							k['icon'] = true;
							k['li_attr'] = k.id;
							k['a_attr']  = { 
												 "href": k.href,
												 "id": k.id + "_anchor"
												 };
							k['state'] = { 
												"loaded": true,
									            "opened": false,
									            "selected": false,
									            "disabled": false
												};
							k['data']  = {};
						}
			})
			return treeArr
		}
		
		
		
export default {
			ids2tree : ids2tree,
			tree2ids : tree2ids,
			expansion : expansion
		}
