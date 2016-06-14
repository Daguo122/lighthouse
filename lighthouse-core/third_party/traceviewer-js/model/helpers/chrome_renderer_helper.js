/**
Copyright (c) 2014 The Chromium Authors. All rights reserved.
Use of this source code is governed by a BSD-style license that can be
found in the LICENSE file.
**/

require("./chrome_process_helper.js");

'use strict';

global.tr.exportTo('tr.model.helpers', function() {
  function ChromeRendererHelper(modelHelper, process) {
    tr.model.helpers.ChromeProcessHelper.call(this, modelHelper, process);
    this.mainThread_ = process.findAtMostOneThreadNamed('CrRendererMain');
    this.compositorThread_ = process.findAtMostOneThreadNamed('Compositor');
    this.rasterWorkerThreads_ = process.findAllThreadsMatching(function(t) {
      if (t.name === undefined)
        return false;
      if (t.name.indexOf('CompositorTileWorker') === 0)
        return true;
      if (t.name.indexOf('CompositorRasterWorker') === 0)
        return true;
      return false;
    });

    this.isChromeTracingUI_ =
        process.labels !== undefined &&
        process.labels.length === 1 &&
        process.labels[0] === 'chrome://tracing';
  };

  // Returns true if there is either a main thread or a compositor thread.
  ChromeRendererHelper.isRenderProcess = function(process) {
    if (process.findAtMostOneThreadNamed('CrRendererMain'))
      return true;
    if (process.findAtMostOneThreadNamed('Compositor'))
      return true;
    return false;
  };

  ChromeRendererHelper.prototype = {
    __proto__: tr.model.helpers.ChromeProcessHelper.prototype,

    // May be undefined.
    get mainThread() {
      return this.mainThread_;
    },

    // May be undefined.
    get compositorThread() {
      return this.compositorThread_;
    },

    // May be empty.
    get rasterWorkerThreads() {
      return this.rasterWorkerThreads_;
    },

    get isChromeTracingUI() {
      return this.isChromeTracingUI_;
    }
  };

  return {
    ChromeRendererHelper: ChromeRendererHelper
  };
});