Ext.define('HatioBB.view.report.DailyReport2', {
	extend : 'Ext.Panel',
	
	xtype : 'dailyreport2',
	
	config : {
		layout : 'fit',
	},
	
	constructor : function(config) {
		config.items = [{
			//html : '일일 리포트',
			docked : 'top'
		}, this.buildReport(), {
			//html : '일일 리포트',
			docked : 'bottom'
		}
		];
		
		this.callParent(arguments);
	},
	
	buildReport : function() {
		var data = {};
		
		/* 어제 일자를 구힌다 */
		var yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		data.date = Ext.Date.format(yesterday, T('format.date'));

		/* 주행 데이타를 설정한다 */
		data.driving = [];
		for(var i = 0;i < 50;i++) {
			data.driving.push({
				driver_id : 'D00' + (i + 1),
				name : '오현석',
				vehicle_id : 'V001',
				reg_no : '가 1234',
				run_dist : 340,
				run_time : 247,
				consmpt : 46,
				effcc : 7.8
			});
		}
		
		/* 정비정보를 설정한다 */
		data.maint = [];
		for(var i = 0;i < 3;i++) {
			data.maint.push({
				vehicle_id : 'V00' + (i + 1),
				reg_no : '가 1234',
				desc : '정기 점검'
			});
		}

		/* 소모품 교체 정보를 설정한다 */
		data.consummable = [];
		for(var i = 0;i < 3;i++) {
			data.consummable.push({
				vehicle_id : 'V00' + (i + 1),
				reg_no : '가 1234',
				part : '엔진 오일'
			});
		}

		return {
			xtype : 'panel',
			
			data : data,
			
			cls : 'bgHGradient',
			
			scrollable : 'vertical',

			tpl : [
			
			'<div class="reportWrap type2">',
				'<div class="reportLayoutFull">',
					'<div class="reportTitle">운전자 주행 리포트 <span>{date}</span></div>',
					'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
			   			 '<th>운전자 ID</th>',
			   			 '<th>차량 ID</th>',
			   			 '<th>주행거리</th>',
			   			 '<th>주행시간</th>',
			   			 '<th>연료소모량</th>',
			   			 '<th>연비</th>',
					     '<th>운전자 이름</th>',
						 '<th>등록번호</th>',
						'</tr>',
						'<tpl for="driving">',
						'<tr>',
							'<td>{name}</td>',
							'<td class="alignCenter">{reg_no}</td>',
							'<td class="alignRight">{run_dist}</td>',
							'<td class="alignRight">{run_time}</td>',
							'<td class="alignRight">{consmpt}</td>',
							'<td class="alignCenter">{effcc}</td>',
							'<td class="alignCenter">{driver_id}</td>',
							'<td class="alignCenter">{vehicle_id}</td>',
						'</tr>',
						'</tpl>',
						'</table>',
					'</div>',	
				'</div>',
				
				'<div class="reportLayoutHalf">',
					'<div class="reportTitle">정비 리포트</div>',
						'<div class="reportItem">',
						'<table frame="hsides" rules="rows">',
						'<tr>',
						'<th>차량 ID</th>',
						'<th>등록번호</th>',
						'<th>정비내역</th>',
						'</tr>',
						'<tpl for="maint">',
						'<tr>',
						'<td class="alignCenter">{vehicle_id}</td>',
						'<td class="alignCenter">{reg_no}</td>',
						'<td class="alignCenter">{desc}</td>',
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
						'<th>차량 ID</th>',
						'<th>등록번호</th>',
						'<th>소모품</th>',
						'</tr>',
						'<tpl for="consummable">',
						'<tr>',
						'<td class="alignCenter">{vehicle_id}</td>',
						'<td class="alignCenter">{reg_no}</td>',
						'<td class="alignCenter">{part}</td>',
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