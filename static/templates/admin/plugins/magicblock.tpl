<form role="form" class="magicblock-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">Full Options</div>
		<div class="col-sm-10 col-xs-12">
			<div class="form-group">
				<label for="fullOptions">Full Options in YAML format.</label>
        <div class="alert alert-warning" style="font-size:2rem;font-weight:bolder;">Options in YAML should follow a [given form](https://www.npmjs.com/package/nodebb-plugin-magicblock)</div>
        <textarea class="form-control magicblock-big-tab" id="fullOptions" name="fullOptions" rows="15" placeholder="---"
        ></textarea>
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
