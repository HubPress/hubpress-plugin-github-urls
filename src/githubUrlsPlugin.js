export function githubUrlsPlugin (hubpress) {

  function getHubpressUrl (meta, windowLocation) {
    let url = windowLocation.protocol + "//" + windowLocation.host;
    console.log(windowLocation);

    if (windowLocation.hostname === "localhost") {
      console.log("Local development");
      return url;
    }

    if (windowLocation.host === `${meta.username}.github.io` || windowLocation.host === `${meta.username}.github.com`) {
      if (meta.branch !== "master") {
        url = url + "/" + meta.repositoryName;
      }
    }
    else {
      if (meta.branch !== "master" && (!meta.cname || meta.cname === "")) {
        url = url + "/" + meta.repositoryName;
      }
    }

    return url;
  }

  function getSiteUrl(meta, addProtocol) {
    let url;
    // TODO change that
    if (meta.cname && meta.cname !== '') {
      url = (addProtocol === false ? '' : 'http:') + '//'+meta.cname;
    }
    else {
      url = (addProtocol === false ? '' : 'https:') + `//${meta.username}.github.io`;
      if (meta.branch !== 'master') {
        url = url + '/' + meta.repositoryName;
      }
    }

    return url;
  }

  function build (config) {
    return {
      site: getSiteUrl(config.meta),
      hubpress: getHubpressUrl(config.meta, window.location),
      theme: getSiteUrl(config.meta, false) + `/themes/${config.theme.name}`,
      images: getSiteUrl(config.meta) + '/images',
      getPostUrl:  postName => postName.replace(/([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/, '/$1/$2/$3/$4.html'),
      getPostGhPath: postName => postName.replace(/([\d]{4})-([\d]{2})-([\d]{2})-([\w-]*)\.adoc/, '$1/$2/$3/$4.html'),
      getSiteUrl: getSiteUrl
    }
  }

  hubpress.on('receiveConfig', function (opts) {
    const urls = build(opts.data.config);
    const mergeConfig = Object.assign({}, opts.data.config, {urls});
    const data = Object.assign({}, opts.data, {config: mergeConfig});
    return Object.assign({}, opts, {data});
  })
}
