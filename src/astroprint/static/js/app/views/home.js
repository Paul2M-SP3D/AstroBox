/*
 *  (c) Daniel Arroyo. 3DaGoGo, Inc. (daniel@astroprint.com)
 *
 *  Distributed under the GNU Affero General Public License http://www.gnu.org/licenses/agpl.html
 */

var FileUploadDashboard = FileUploadCombined.extend({
	container: null,
	circleProgress: null,
	initialize: function(options)
	{
		FileUploadCombined.prototype.initialize.call(this, options);

		this.container = this.$el.closest('.upload-btn');
	},
	render: function()
	{
		this.refreshAccept();
	},
	started: function(data)
	{
		if (data.files && data.files.length > 0) {
			this.container.addClass('uploading');

			FileUploadCombined.prototype.started.call(this, data);

			if (this.circleProgress === null) {
				var progressContainer = this.container.find('.app-image');

				this.circleProgress = this.container.find(".progress").circleProgress({
			        value: 0,
			        animation: false,
			        size: progressContainer.innerWidth() - 12,
			        fill: { color: 'white' }
		    	});

				$(window).bind('resize', _.bind(function() {
					if (this.container.hasClass('uploading')) {
						this.circleProgress.circleProgress({size: progressContainer.innerWidth() - 12});
					}
				}, this));
			}
		}
	},
	progress: function(progress)
	{
		this.container.find('.progress span').html(Math.round(progress)+'<i>%</i>');
		this.circleProgress.circleProgress({value: progress / 100.0});
	},
	failed: function(error)
	{
		this.container.addClass('failed').removeClass('uploading');

		setTimeout(_.bind(function(){
			this.container.removeClass('failed');
		}, this), 3000);
		console.error(error);
	},
	success: function(data)
	{
		FileUploadCombined.prototype.success.call(this, data);

		if (this.currentFileType != 'design') {
			this.container.removeClass('uploading');
		}
	}
});

var HomeView = Backbone.View.extend({
	el: '#home-view',
	uploadBtn: null,
	events: {
		'show': 'onShow',
		'click .new-release a.check': 'onReleaseInfoClicked',
		'click .new-release a.close': 'onCloseReleaseInfoClicked'
	},
	initialize: function()
	{
		this.uploadBtn = new FileUploadDashboard({el: "#home-view #app-container .upload-btn .file-upload"});
		this.listenTo(app.printerProfile, 'change:driver', this.onDriverChanged);
		this.onDriverChanged(app.printerProfile, app.printerProfile.get('driver'));

		this.listenTo(app.socketData, 'new_sw_release', _.bind(function(data){
			this.$('.new-release .version-label').text(data.release.major+'.'+data.release.minor+'('+data.release.build+')');
			this.$('.new-release').removeClass('hide');			
		}, this));
	},
	onShow: function()
	{
		this.uploadBtn.refreshAccept();
	},
	onDriverChanged: function(model, newDriver)
	{
		if (newDriver == 'marlin') {
			this.$("#app-container ul li.gcode-terminal-app-icon").removeClass('hide');
		} else {
			this.$("#app-container ul li.gcode-terminal-app-icon").addClass('hide');
		}
	},
	onReleaseInfoClicked: function(e)
	{
		e.preventDefault();
		if (!app.router.settingsView) {
			app.router.settingsView = new SettingsView();
		}

		app.router.settingsView.subviews['software-update'].onCheckClicked(e);
	},
	onCloseReleaseInfoClicked: function(e)
	{
		e.preventDefault();
		this.$('.new-release').remove()
	}
});
