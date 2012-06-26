Ext.define('HatioBB.view.report.MonthlyReport', {
	extend : 'Ext.Panel',
	
	xtype : 'monthlyreport',
	
	config : {
		cls : 'grayBg',
		
		layout : 'fit'
	},
	
	constructor : function(config) {
		config.items = [{
			//html : '일일 리포트',
			docked : 'top'
		}, this.buildReport(), {
			//html : '일일 리포트',
			docked : 'bottom'
		}];
		
		this.callParent(arguments);		
		this.refresh();
	},
	
	refresh : function() {
		var self = this;
		var data = {};
		var run_store = Ext.getStore('MonthlyReportStore');
		
		run_store.load(function(records) {
			var record = records[0].data;
			/* 주행 데이타를 설정한다 */
			data.driving = record.driving;
			/* 정비정보를 설정한다 */
			data.maint = record.maint;
			/* 소모품 교체 정보를 설정한다 */
			data.consummable = record.consumable;

			self.down('[itemId=report]').setData(data);
		});
	},
	
	buildReport : function() {
		return {
			xtype : 'panel',			
			
			itemId : 'report',
						
			data : {},
			
			cls : 'bgHGradient',
			
			scrollable : 'vertical',

			tpl : [
			
			'<div class="reportWrap type2">',
				'<div class="reportLayoutFull">',
					'<div class="reportTitle"> 주행 추이 리포트<span>{date}</span></div>',
					'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
			   			 '<th>년도</th>',
					     '<th>월</th>',
			   			 '<th>주행거리</th>',					
						 '<th>주행시간</th>',			
			   			 '<th>연료소모량</th>',
			   			 '<th>연비</th>',
						'</tr>',
						'<tpl for="driving">',
						'<tr>',
							'<td>{year}</td>',
							'<td class="alignCenter">{month}</td>',							
							'<td class="alignCenter">{run_dist}</td>',
							'<td class="alignCenter">{run_time}</td>',							
							'<td class="alignCenter">{consmpt}</td>',
							'<td class="alignCenter">{effcc}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',

				'<div class="reportLayoutHalf">',
					'<div class="reportTitle">정비 추이 리포트</div>',
						'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
						'<th>년도</th>',
						'<th>월</th>',
						'<th>횟수</th>',
						'</tr>',
						'<tpl for="maint">',
						'<tr>',
						'<td class="alignCenter">{year}</td>',
						'<td class="alignCenter">{month}</td>',
						'<td class="alignCenter">{count}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',	

				'<div class="reportLayoutHalf">',	
					'<div class="reportTitle">소모품 교체 리포트</div>',
						'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
						'<th>소모품 파트</th>',
						'<th>횟수</th>',
						'</tr>',
						'<tpl for="consummable">',
						'<tr>',
						'<td class="alignCenter">{part}</td>',
						'<td class="alignCenter">{count}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',	
			'</div>',
			]
			
		};
	}
});