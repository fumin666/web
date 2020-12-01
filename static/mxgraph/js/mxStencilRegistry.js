/**
 * Overrides stencil registry for dynamic loading of stencils.
 */
(function()
{
	/**
	 * Maps from library names to an array of Javascript filenames,
	 * which are synchronously loaded. Currently only stencil files
	 * (.xml) and JS files (.js) are supported.
	 * IMPORTANT: For embedded diagrams to work entries must also
	 * be added in EmbedServlet.java.
	 */
	mxStencilRegistry.libraries = {};

	/**
	 * Stores all package names that have been dynamically loaded.
	 * Each package is only loaded once.
	 */
	mxStencilRegistry.packages = [];
	
	// Extends the default stencil registry to add dynamic loading
	mxStencilRegistry.getStencil = function(name)
	{
		var result = mxStencilRegistry.stencils[name];
		
		if (result == null)
		{
			var basename = mxStencilRegistry.getBasenameForStencil(name);
			
			// Loads stencil files and tries again
			if (basename != null)
			{
				var libs = mxStencilRegistry.libraries[basename];

				if (libs != null)
				{
					if (mxStencilRegistry.packages[basename] == null)
					{
						mxStencilRegistry.packages[basename] = 1;
						
						for (var i = 0; i < libs.length; i++)
						{
							var fname = libs[i];
							
							if (fname.toLowerCase().substring(fname.length - 4, fname.length) == '.xml')
							{
								mxStencilRegistry.loadStencilSet(fname, null);
							}
							else if (fname.toLowerCase().substring(fname.length - 3, fname.length) == '.js')
							{
								var req = mxUtils.load(fname);
								
								if (req != null)
								{
									eval.call(window, req.getText());
								}
							}
							else
							{
								// FIXME: This does not yet work as the loading is triggered after
								// the shape was used in the graph, at which point the keys have
								// typically been translated in the calling method.
								//mxResources.add(fname);
							}
						}
					}
				}
				else
				{
					mxStencilRegistry.loadStencilSet(STENCIL_PATH + '/' + basename + '.xml', null);
				}
				
				result = mxStencilRegistry.stencils[name];
			}
		}
		
		return result;
	};
	
	// Returns the basename for the given stencil or null if no file must be
	// loaded to render the given stencil.
	mxStencilRegistry.getBasenameForStencil = function(name)
	{
		var parts = name.split('.');
		var tmp = null;
		
		if (parts.length > 0 && parts[0] == 'mxgraph')
		{
			tmp = parts[1];
			
			for (var i = 2; i < parts.length - 1; i++)
			{
				tmp += '/' + parts[i];
			}
		}

		return tmp;
	};

	// Loads the given stencil set
	mxStencilRegistry.loadStencilSet = function(stencilFile, postStencilLoad, force)
	{
		force = (force != null) ? force : false;
		
		// Uses additional cache for detecting previous load attempts
		var xmlDoc = mxStencilRegistry.packages[stencilFile];
		
		if (force || xmlDoc == null)
		{
			var install = false;
			
			if (xmlDoc == null)
			{
				var req = mxUtils.load(stencilFile);
				xmlDoc = req.getXml();
				mxStencilRegistry.packages[stencilFile] = xmlDoc;
				install = true;
			}
		
			mxStencilRegistry.parseStencilSet(xmlDoc, postStencilLoad, install);
		}
	};
	
	// Parses the given stencil set
	mxStencilRegistry.parseStencilSet = function(xmlDocument, postStencilLoad, install)
	{
		install = (install != null) ? install : true;
		var root = xmlDocument.documentElement;
		var shape = root.firstChild;
		var packageName = '';
		var name = root.getAttribute('name');
		
		if (name != null)
		{
			packageName = name + '.';
		}
		
		while (shape != null)
		{
			if (shape.nodeType == mxConstants.NODETYPE_ELEMENT)
			{
				name = shape.getAttribute('name');
				
				if (name != null)
				{
					packageName = packageName.toLowerCase();
					var stencilName = name.replace(/ /g,"_");
						
					if (install)
					{
						mxStencilRegistry.addStencil(packageName + stencilName.toLowerCase(), new mxStencil(shape));
					}
	
					if (postStencilLoad != null)
					{
						var w = shape.getAttribute('w');
						var h = shape.getAttribute('h');
						
						w = (w == null) ? 80 : parseInt(w, 10);
						h = (h == null) ? 80 : parseInt(h, 10);

						postStencilLoad(packageName, stencilName, name, w, h);
					}
				}
			}
			
			shape = shape.nextSibling;
		}
	};
})();
