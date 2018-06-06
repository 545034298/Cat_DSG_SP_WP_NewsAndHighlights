import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IWebPartContext
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CatDsgSpWp1003NewsAndHighlightsWebPart.module.scss';
import * as strings from 'CatDsgSpWp1003NewsAndHighlightsWebPartStrings';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import * as $ from 'jquery';
require('./CatDsgSpWp1003NewsAndHighlightsWebPartExtension.js');

export interface ICatDsgSpWp1003NewsAndHighlightsWebPartProps {
  description: string;
  listName: string;
}

export interface SlideImageUrl {
  Description: string;
  Url: string;
}

export interface SlideNewsAndHignLightsItem {
  Title: string;
  SlideCaption: string;
  SlideUrl: string;
  SlideImageUrl: SlideImageUrl;
}

export interface SlideNewsAndHignLightsItems {
  value: SlideNewsAndHignLightsItem[];
}

export default class CatDsgSpWp1003NewsAndHighlightsWebPart extends BaseClientSideWebPart<ICatDsgSpWp1003NewsAndHighlightsWebPartProps> {

  public render(): void {
    this.context.statusRenderer.clearError(this.domElement);
    this.properties.description=strings.CatDsgSpWp1003NewsAndHignlightsDescription;
    require('./CatDsgSpWp1003NewsAndHighlightsWebPart.scss');
    this.domElement.innerHTML = `
      <div class="${ styles.catDsgSpWp1003NewsAndHighlights}">
        <div class="${ styles.container}">
          <div class="fuse_NewsSlider catDsgSpWp1003NewsAndHighlights-Slideshow" id="${this.context.instanceId}_slideShow_">
            <div class="catDsgSpWp1003NewsAndHighlights-SlideshowItems" id="${this.context.instanceId}_slideShow_container">
            </div>
            <div class="catDsgSpWp1003NewsAndHighlights-SlideShow-noResults">`+strings.CatDsgSpWp1003NewsAndHighlightsNoDataMesssage+`</div>
            <div class="catDsgSpWp1003NewsAndHighlights-SlideshowPagingBarOverlay" id="${this.context.instanceId}_slideShow_pagingOverlay"></div>
            <div class="catDsgSpWp1003NewsAndHighlights-SlideshowPagingBar" id="${this.context.instanceId}_slideShow_pagingBar">
            </div>
          </div>
        </div>
      </div>`;
    this.renderNewsAndHighLights();
  }
  private renderNewsAndHighLights() {
    this.getSlideNewsAndHighLights(this.properties.listName).then((slideNewsAndHighLights: SlideNewsAndHignLightsItems) => {
      var CatDsgSpWp1003NewsAndHighlights = require('./CatDsgSpWp1003NewsAndHighlightsWebpart-js.js');
      if (slideNewsAndHighLights.value.length > 0) {
        $(this.domElement).find(".cbs-SlideShow-noResults").hide();
        let dynamicNewsAndHighlightsHtml = ``;
        let dynamicNewsAndHighlightsPagingBarHrml = ``;
        for (var i = 0; i < slideNewsAndHighLights.value.length; i++) {
          let slideNewsAndHighLightItem = slideNewsAndHighLights.value[i];
          let slidecaptionTrimmer = this.wordTrimmer(slideNewsAndHighLightItem.SlideCaption, 180);
          let slideNewsAndHighlightItemHtml = `
              <div class="catDsgSpWp1003NewsAndHighlights-largePictureContainer" id="${this.context.instanceId}_largePicture_container">
                <div class="catDsgSpWp1003NewsAndHighlights-largePictureImageContainer" id="${this.context.instanceId}_largePicture_pictureContainer">
                  <a class="catDsgSpWp1003NewsAndHighlights-pictureImgLink" href="${slideNewsAndHighLightItem.SlideImageUrl.Url}" title="${slideNewsAndHighLightItem.Title}" id="${this.context.instanceId}_largePicture_pictureLink">
                    <img class="catDsgSpWp1003NewsAndHighlights-largePictureImg" id="${this.context.instanceId}_largePicture_picture"  alt="${slideNewsAndHighLightItem.Title}" src="${slideNewsAndHighLightItem.SlideImageUrl.Url}?width=918&amp;height=518">
                  </a>
                </div>
                <div class="catDsgSpWp1003NewsAndHighlights-largePictureDataOverlay"  id="${this.context.instanceId}_largePicture_dataContainerOverlay"></div>
                <div class="catDsgSpWp1003NewsAndHighlights-largePictureDataContainer" id="${this.context.instanceId}_largePicture_dataContainer">
                  <div class="fuse_data">
                    <a class="catDsgSpWp1003NewsAndHighlights-largePictureLine1Link" href="${slideNewsAndHighLightItem.SlideUrl}" title="${slideNewsAndHighLightItem.Title}" id="${this.context.instanceId}_largePicture_line1Link">
                      <h2 class="catDsgSpWp1003NewsAndHighlights-largePictureLine1 ms-noWrap" id="${this.context.instanceId}_largePicture_line1">${slideNewsAndHighLightItem.Title}</h2>
                    </a>
                    <div class="catDsgSpWp1003NewsAndHighlights-largePictureLine2 ms-noWrap" title="${slideNewsAndHighLightItem.SlideCaption}" id="${this.context.instanceId}_largePicture_line2"> ${slidecaptionTrimmer} </div>
                  </div>
                </div>
              </div>
              `;
          let slideNewsAndHignlightsPagingBarItemHtml = `             
                <a class="catDsgSpWp1003NewsAndHighlights-SlideshowPagingLink-Inactive" data-index="${i}" href="javascript:{}"  id="${this.context.instanceId}_slideShow_pagingControl${i}">
                  <span>&nbsp;</span>
                </a>`;
          dynamicNewsAndHighlightsHtml += slideNewsAndHighlightItemHtml;
          dynamicNewsAndHighlightsPagingBarHrml += slideNewsAndHignlightsPagingBarItemHtml;
        }
        this.domElement.querySelector(".catDsgSpWp1003NewsAndHighlights-SlideshowItems").innerHTML = dynamicNewsAndHighlightsHtml;
        this.domElement.querySelector(".catDsgSpWp1003NewsAndHighlights-SlideshowPagingBar").innerHTML = dynamicNewsAndHighlightsPagingBarHrml;
        $(this.domElement).find('.catDsgSpWp1003NewsAndHighlights-SlideshowPagingBar>a').each((index, ele) => {
          ele.addEventListener('click', function () {
            var slideIndex = ele.getAttribute("data-index");
            CatDsgSpWp1003NewsAndHighlights.SlideShow_OnClick(this, slideIndex);
          });
        });

        var slideshows = $(this.domElement).find(".catDsgSpWp1003NewsAndHighlights-Slideshow");
        CatDsgSpWp1003NewsAndHighlights.SlideCount = slideNewsAndHighLights.value.length;
        for (var j = 0; j < slideshows.length; j++) {
          CatDsgSpWp1003NewsAndHighlights.InitializeSlideShow(slideshows[j]);
        }
      } else {
        $(this.domElement).find(".catDsgSpWp1003NewsAndHighlights-SlideShow-noResults").show();
      }
    }, (error: any) => {
      this.context.statusRenderer.renderError(this.domElement, error);
    });
  }
  private validateRequiredProperty(value: string): string {
    if (value === null || (value != null && value.trim().length === 0)) {
      return strings.CatDsgSpWp1003NewsAndHighlightsRequiredPropertyMessage;
    }
    return "";
  }

  private getSlideNewsAndHighLights(listName: string): Promise<any> {

    const queryString: string = '$select=Title,SlideUrl,SlideCaption,Modified,Created,SlideImageUrl';
    const sortingString: string = '$orderby=Modified desc';
    let filterString: string = `$filter=(SlideStatus eq 1)`;

    let url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items?${queryString}&${filterString}&${sortingString}`;
    return this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {

        if (response.status === 404) {
          this.context.statusRenderer.renderError(this.domElement, strings.CatDsgSpWp1003NewsAndHighlightsListNotFoundMessage + `:'${this.properties.listName}'`);
          return [];
        }
        else if (response.status === 400) {
          this.context.statusRenderer.renderError(this.domElement, strings.CatDsgSpWp1003NewsAndHighlightsBadRequestMessagePrefix + url);
          return [];
        }
        else {
          return response.json();
        }
      }, (error: any) => {
        this.context.statusRenderer.renderError(this.domElement, error);
      });
  }

  private wordTrimmer(text: string, limit: number): string {
    if (text.byteLength() > limit) {
      var truncatedArticleTitle = text.truncateString(limit);
      var lastSpaceCharacterIndex = truncatedArticleTitle.lastIndexOf(' ');
      if (lastSpaceCharacterIndex == -1) {
        lastSpaceCharacterIndex = truncatedArticleTitle.length - 1;
      }
      text = truncatedArticleTitle.substring(0, lastSpaceCharacterIndex) + '...';
    }
    return text;
  }

  private getNewsAndHighlightsList(listName: string): Promise<any> {
    const queryString: string = '$select=Title,RootFolder/ServerRelativeUrl&$expand=RootFolder';
    let url = `${this.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')?${queryString}`;
    return this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        if (response.status === 404) {
          this.context.statusRenderer.renderError(this.domElement, strings.CatDsgSpWp1003NewsAndHighlightsListNotFoundMessage + `:'${this.properties.listName}'`);
          return [];
        } else if (response.status === 400) {
          this.context.statusRenderer.renderError(this.domElement, strings.CatDsgSpWp1003NewsAndHighlightsBadRequestMessagePrefix + url);
          return [];
        }
        else {
          return response.json();
        }
      });
  }

  //#region protected methods
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('listName', {
                  label: strings.CatDsgSpWp1003NewsAndHighlightsListNameFieldLabel,
                  onGetErrorMessage: this.validateRequiredProperty.bind(this)
                })
              ]
            }
          ]
        }
      ]
    };
  }
  //#endregion
}
