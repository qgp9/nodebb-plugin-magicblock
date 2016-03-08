<form role="form" class="magicblock-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Full Options</div>
		<div class="col-sm-10 col-xs-12">
			<p class="lead">
        <div class="alert alert-danger" style="font-size:2rem;font-weight:bolder;">These configurations are not implemented yet.<br/> Do not modify to prevent any effect later</div>
				Adjust these settings. You can then retrieve these settings in code via:
				<code>meta.settings.get('magicblock');</code>
			</p>
			<div class="form-group">
				<label for="fullOptions">Full Options in JSON format.</label>
        <div class="alert alert-danger" style="font-size:2rem;font-weight:bolder;">This will overide all options above ( if something is there )</div>
        <div class="alert alert-danger" style="font-size:2rem;font-weight:bolder;">Options in JSON should follow a given form</div>
        <textarea class="form-control magicblock-big-tab" id="fullOptions" name="fullOptions" rows="15" placeholder="---"
        ></textarea>
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
