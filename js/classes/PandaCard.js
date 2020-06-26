/**
 * This class deals with showing panda information on a card and sorts them in the panda area.
 * @class MenuClass
 * @author JohnnyRS - johnnyrs@allbyjohn.com
 */
class PandaCard {
  /**
   * @param  {number} myId             - The unique id of the panda for this card.
   * @param  {object} hitInfo          - The data information for this panda.
   * @param  {object} tabsObj          - The tab information that this card is in.
   * @param  {number} [tabUnique=null] - The unique number for the tab to add card in.
   * @param  {bool} [fromDB=false]     - Did this panda get loaded from database or a default value?
   */
  constructor(myId, hitInfo, tabsObj, tabUnique=null, fromDB=false) {
    this.myId = myId;
    this.dbId = hitInfo.dbId;
    this.tabsObj = tabsObj;
    this.reqName = {valueName:'reqName', id:'#pcm_hitReqName', label:''};
    this.reqName1Line = {valueName:'reqName', id:'#pcm_hitReqName1', label:''};
    this.friendlyReqName = {valueName:'friendlyReqName', id:'#pcm_hitReqName', label:''};
    this.groupId = {valueName:'groupId', id:'#pcm_groupId', label:''};
    this.price = {valueName:'price', id:'#pcm_hitPrice', label:''};
    this.numbers = {valueName:'hitsAvailable', id:'#pcm_numbers', label:''};
    this.title = {valueName:'title', id:'#pcm_hitTitle', label:''};
    this.friendlyTitle = {valueName:'friendlyTitle', id:'#pcm_hitTitle', label:''};
    this.collectTip = 'Start Collecting this Panda Hit';
    this.details = 'Display and edit all options for this Panda.';
    this.delete = 'Delete this Panda hit. [CTRL] click to delete multiple hits.';
    this.hamTip = 'Collect hits from this Panda only! Delayed ham mode can be turned on by clicking and holding this button.';
    this.appendCard(hitInfo, tabUnique, fromDB);
    this.updateAllCardInfo(hitInfo);
  }
  /** Updates the information in the panda card with the newer information.
   * @param  {object} [hitInfo=null] - The information from a panda hit to update to card. */
  updateAllCardInfo(hitInfo=null) {
    if (hitInfo===null) return;
    let titleSelect = $(`${this.title.id}_${this.myId}`);
    const titlePre = (titleSelect.attr('data-original-title')!==undefined) ? "data-original-" : "";
    let reqName = (hitInfo.data[this.friendlyReqName.valueName]!=="") ? hitInfo.data[this.friendlyReqName.valueName] : hitInfo.data[this.reqName.valueName];
		$(`${this.reqName.id}_${this.myId}`).attr(`${titlePre}title`, `${reqName}<br>${hitInfo.data[this.groupId.valueName]}`).html(`${reqName}`);
		$(`${this.reqName1Line.id}_${this.myId}`).attr(`${titlePre}title`, `${reqName}<br>${hitInfo.data[this.groupId.valueName]}`).html(`${reqName}`);
		$(`${this.groupId.id}_${this.myId}`).html(`${shortenGroupId(hitInfo.data[this.groupId.valueName])}`);
		$(`${this.price.id}_${this.myId}`).html(`${parseFloat(hitInfo.data[this.price.valueName]).toFixed(2)}`);
		if (hitInfo[this.numbers.valueName]>1) $(`${this.numbers.id}_${this.myId}`).html(`[${hitInfo[this.numbers.valueName]}]`);
    let title = (hitInfo.data[this.friendlyTitle.valueName]!=="") ? hitInfo.data[this.friendlyTitle.valueName] : hitInfo.data[this.title.valueName];
    titleSelect.attr(`${titlePre}title`, `${title}`).html(`${title}`);
  }
  /** Used to show or hide elements in a card for display usage.
   * @param  {number} id      - The id name of the specific element to show or hide.
   * @param  {number} myId    - The unique ID for a panda job.
   * @param  {string} closest - The selector expression used in the closest method of element.
   * @param  {bool} show      - Show this element or hide it? */
  hideShow(id, closest, show) {
    const ele = (closest!=="") ? $(`${id}_${this.myId}`).closest(closest) : $(`${id}_${this.myId}`);
    if (show) $(ele).show(); else $(ele).hide();
  }
  /** Update the card display by showing or hiding different elements in the card. */
  updateCardDisplay() {
    const oneLine = (globalOpt.getCardDisplay()===0), min = (globalOpt.getCardDisplay()===1);
    const normal = (globalOpt.getCardDisplay()===2);
    this.hideShow(this.reqName.id, ".pcm_nameGroup", (!oneLine));
    this.hideShow(this.reqName1Line.id, ".pcm_nameGroup", (oneLine));
    this.hideShow(this.price.id, ".pcm_priceGroup", (!oneLine && !min));
    this.hideShow(this.groupId.id, "", (!oneLine));
    this.hideShow(this.title.id, "", (!oneLine && !min));
    this.hideShow("#pcm_hitStats", "", (!oneLine));
    this.hideShow("#pcm_buttonGroup", "", (!oneLine));
    const addThis = (oneLine) ? "pcm_oneLine" : "";
    const removeThis = (!oneLine) ? "pcm_oneLine" : "";
    $(`#pcm_pandaCard_${this.myId}`).addClass(addThis).removeClass(removeThis);
  }
  /** Create the status area for the panda card.
   * @param  {object} hitInfo         - 
   * @param  {object} appendHere      - Append the status area to this element.
   * @param  {string} [oneLine=false] - Should this card only show one line info? */
  createCardStatus(hitInfo, appendHere, oneLine=false) {
    let element = (oneLine) ? 'span' : 'div';
    let one = (oneLine) ? '1' : '';
    let search = (hitInfo.search) ? ` (<span class='${hitInfo.search}search'>${hitInfo.search.toUpperCase()} search</span>)` : '';
    $(`<${element} class="pcm_hitStats mr-auto" id="pcm_hitStats${one}_${this.myId}"></${element}>`).html(`[ <span class="pcm_hitAccepted" id="pcm_hitAccepted${one}_${this.myId}"></span> | <span class="pcm_hitFetched" id="pcm_hitFetched${one}_${this.myId}"></span> ]${search}`).css('cursor', 'default').hide().appendTo(appendHere)
  }
  /** Create the button group area for the panda card.
   * @param  {object} hitInfo    - The information from a panda hit to update to card.
   * @param  {object} appendHere - Append the button group area to this element. */
  createCardButtonGroup(hitInfo, appendHere) {
    const group = $(`<div class="card-text" id="pcm_buttonGroup_${this.myId}"></div>`).hide();
    const textCollect = (hitInfo.search) ? "-Collecting-" : "Collect";
    $(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_collectButton pcm_buttonOff shadow-none" id="pcm_collectButton_${this.myId}" data-toggle="tooltip" data-html="true" data-placement="bottom" title="${this.collectTip}"></button>`).append(`<span>${textCollect}</span>`).appendTo(group);
    if (!hitInfo.search) $(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_hamButton pcm_buttonOff shadow-none" id="pcm_hamButton_${this.myId}" data-toggle="tooltip" data-html="true" data-placement="bottom" title="${this.hamTip}"></button>`).append(`<span>GoHam</span>`).appendTo(group);
    $(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_detailsButton pcm_buttonOff shadow-none" id="pcm_detailsButton_${this.myId}" data-toggle="tooltip" data-html="true" data-placement="bottom" title="${this.details}"></button>`).append(`<span>Details</span>`).appendTo(group);
    $(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_deleteButton pcm_buttonOff shadow-none" id="pcm_deleteButton_${this.myId}" data-toggle="tooltip" data-html="true" data-placement="bottom" title="${this.delete}"></button>`).append(`<span>X</span>`).appendTo(group);
    appendHere.append(group);
  }
  /** Used to display a card with only one line for display purposes.
   * @param  {object} hitInfo */
  oneLineCard(hitInfo) {
    const nameGroup = $(`<div class="pcm_nameGroup row w-90"></div>`).css('cursor', 'default').hide().append(`<span class="pcm_reqName col mr-auto px-1 text-truncate" id="pcm_hitReqName1_${this.myId}"></span>`);
    this.createCardStatus(hitInfo, nameGroup, true);
    const buttonGroup = $(`<span class="d-flex pl-1 pcm_buttonGroup1" id="pcm_buttonGroup1_${this.myId}"></span>`).appendTo(nameGroup);
    buttonGroup.append(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_collectButton pcm_buttonOff shadow-none" type="button" id="pcm_collectButton1_${this.myId}"><span>C</span></button>`);
    buttonGroup.append(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_hamButton pcm_buttonOff shadow-none" type="button" id="pcm_hamButton1_${this.myId}"><span>H</span></button>`);
    buttonGroup.append(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_detailsButton pcm_buttonOff shadow-none" type="button" id="pcm_detailsButton1_${this.myId}"><span>D</span></button>`);
    buttonGroup.append(`<button class="btn btn-light btn-xs btn-outline-dark toggle-text pcm_hitButton pcm_deleteButton pcm_buttonOff shadow-none" type="button" id="pcm_deleteButton1_${this.myId}"><span>X</span></button>`);
    return nameGroup;
  }
  /** Create the card and append it to an element given.
   * @param  {object} hitInfo    - The information from a panda hit to update to card.
   * @param  {object} appendHere - Append the button group area to this element. */
  createCard(hitInfo, appendHere) {
    const searchCard = (hitInfo.data.search) ? " pcm_searching" : "";
    const card = $(`<div class="card text-light border pcm_pandaCard${searchCard}" id="pcm_pandaCard_${this.myId}"></div>`).data("myId",this.myId);
    const body = $(`<div class="card-body p-0"></div>`).appendTo(card);
    const text = $(`<div class="card-text p-0" id="output_${this.myId}">`).appendTo(body);
    $(`<div class="pcm_nameGroup row w-100 px-0"></div>`).append($(`<span class="pcm_reqName col mr-auto px-0 text-truncate" id="pcm_hitReqName_${this.myId}" data-toggle="tooltip" data-html="true" data-placement="bottom" title=""></span>`).css('cursor', 'default')).append($(`<span class="pcm_groupId col col-auto text-right px-0" id="pcm_groupId_${this.myId}"></span>`).css('cursor', 'pointer').data('myId',this.myId).data('double',0)).appendTo(text);
    this.oneLineCard(hitInfo).appendTo(text);
    $(`<div class="pcm_priceGroup"></div>`).hide().append($(`<span class="pcm_price text-truncate" id="pcm_hitPrice_${this.myId}"></span>`).css('cursor', 'default')).append($(`<span class="pcm_numbers text-truncate pl-1" id="pcm_numbers_${this.myId}"></span>`)).appendTo(text);
    $(`<div class="pcm_title text-truncate" id="pcm_hitTitle_${this.myId}" data-toggle="tooltip" data-html="true" data-placement="bottom" title=""></div>`).css('cursor', 'default').hide().appendTo(text);
    this.createCardStatus(hitInfo, text);
    this.createCardButtonGroup(hitInfo, text);
    appendHere.append(card);
    card.find('[data-toggle="tooltip"]').tooltip({delay: {show:1200}, trigger:'hover'});
  }
  /** Append this card to the panda tab.
   * @param  {object} hitInfo          - Data for the panda connected to this card.
   * @param  {number} [tabUnique=null] - The unique number for the tab this card needs to be in.
   * @param  {bool} [fromDB=false]     - Did this panda come from the database or a default value? */
  appendCard(hitInfo, tabUnique=null, fromDB=false) {
    const thisTabUnique = (tabUnique!==null) ? tabUnique : this.tabsObj.currentTab;
    if (!fromDB) this.tabsObj.setPosition(thisTabUnique, hitInfo.dbId, !fromDB);
    this.createCard(hitInfo, $(`#pcm-t${thisTabUnique}Content .card-deck`));
    this.updateCardDisplay();
  }
  /** Remove this panda card from UI.
   * @param  {function} removeFunc - Function to call after remove card animation is done. */
  removeCard(removeFunc) {
    $(`#pcm_pandaCard_${this.myId}`).effect('slide', { direction:'left', mode:'hide' }, 250, () => { 
      $(`#pcm_pandaCard_${this.myId}`).remove(); removeFunc();
    });
  }
  /** Mark this search panda as searching in the search class. */
  pandaSearchingNow() {
    $(`#pcm_collectButton_${this.myId}`).html("-Searching-").removeClass("pcm_searchCollect")
      .addClass("pcm_searchOn");
  }
  /** Mark this search panda as collecting as a regular panda. */
  pandaCollectingNow() {
    $(`#pcm_collectButton_${this.myId}`).html("-Collecting-").removeClass("pcm_searchOn")
      .addClass("pcm_searchCollect");
  }
  /** Disable this search panda. */
  pandaDisabled() {
    const collectB = $(`#pcm_collectButton_${this.myId}`);
    if (!collectB.hasClass('pcm_searchCollect'))
      collectB.html("-Disabled-").removeClass("pcm_searchOn").addClass("pcm_searchDisable");
  }
  /** Adds a string to or changes the collect help tip.
   * @param  {string} [change=''] - The string to add to or change the collect help tip.
   * @param  {bool} [add=false]   - Should string be added to original help tip? */
  collectTipChange(change='', add=false) {
    let newTitle = (change !== '') ? ((add) ? this.collectTip + change : change) : this.collectTip;
    $(`#pcm_collectButton_${this.myId}`).attr('data-original-title', newTitle).tooltip('update');
  }
}