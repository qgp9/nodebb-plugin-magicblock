<form role="form" class="magicblock-settings">
	<div class="row">
		<div class="col-sm-2 col-xs-12 settings-header">General</div>
		<div class="col-sm-10 col-xs-12">
			<p class="lead">
        <div class="alert alert-danger" style="font-size:2rem;font-weight:bolder;">These configurations are not implemented yet.<br/> Do not modify to prevent any effect later</div>
				Adjust these settings. You can then retrieve these settings in code via:
				<code>meta.settings.get('magicblock');</code>
			</p>
			<fieldset class="form-group form-inline">
				<label for="blockopener">Block opener</label>
				<input type="text" id="blockopener" name="blockopener" title="Block opener" class="form-control" placeholder="{{">
				<label for="blockcloser">Block closer</label>
				<input type="text" id="blockcloser" name="blockcloser" title="Block closer" class="form-control" placeholder="}}">
			</fieldset>
			<div class="form-group">
				<label for="allowedAttribute">Allowed attributes ( JSON )</label>
        <textarea class="form-control" id="allowedAttribute" name="allowedAttribute" rows="5" placeholder="{\t'*': { 'class':['*'], 'style':['*']  },
                          'a': { 'role':['button'] }
                           }"></textarea>
			</div>
			<div class="form-group">
				<label for="macroTemplates">Macro Template ( JSON )</label>
        <textarea class="form-control" id="macroTemplates" name="macroTemplates" rows="5" placeholder="'*': { 'class':['*'], 'style':['*']  },
'a': { 'role':['button'] }"
        
        ></textarea>
			</div>
		</div>
	</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>
