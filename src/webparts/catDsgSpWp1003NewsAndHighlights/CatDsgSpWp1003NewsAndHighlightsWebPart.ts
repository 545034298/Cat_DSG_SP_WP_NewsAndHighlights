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
require('./CatDsgSpWp1003NewsAndHighlightsWebPartExtension.js');
import SlideShow from './CatDsgSpWp1003NewsAndHighlightsWebpartSlideShow';
import JQueryLoader from './JQueryLoader';

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
    this.properties.description = strings.CatDsgSpWp1003NewsAndHignlightsDescription;
    JQueryLoader.LoadDependencies("https://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.11.1.min.js", []).then((object) => {
      require('./CatDsgSpWp1003NewsAndHighlightsWebPart.scss');
      this.domElement.innerHTML = `
      <div class="${ styles.catDsgSpWp1003NewsAndHighlights}">
        <div class="${ styles.container}">
          <div class="${styles.catDsgSpWp1003NewsAndHighlightsSlideshow}" id="${this.context.instanceId}_slideShow_">
            <div class="${styles.catDsgSpWp1003NewsAndHighlightsSlideShowItems}" id="${this.context.instanceId}_slideShow_container">
            </div>
            <div class="${styles.catDsgSpWp1003NewsAndHighlightsSlideShowNoResults}">` + strings.CatDsgSpWp1003NewsAndHighlightsNoDataMesssage + `</div>
            <div class="${styles.catDsgSpWp1003NewsAndHighlightsSlideshowPagingBarOverlay}" id="${this.context.instanceId}_slideShow_pagingOverlay"></div>
            <div class="${styles.catDsgSpWp1003NewsAndHighlightsSlideshowPagingBar}" id="${this.context.instanceId}_slideShow_pagingBar">
            </div>
          </div>
        </div>
      </div>`;
      this.renderNewsAndHighLights();
    });
  }
  private renderNewsAndHighLights() {
    this.getSlideNewsAndHighLights(this.properties.listName).then((slideNewsAndHighLights: SlideNewsAndHignLightsItems) => {
      if (slideNewsAndHighLights.value.length > 0) {
        $(this.domElement).find("." + styles.catDsgSpWp1003NewsAndHighlightsSlideShowNoResults).hide();
        let dynamicNewsAndHighlightsHtml = ``;
        let dynamicNewsAndHighlightsPagingBarHrml = ``;
        for (var i = 0; i < slideNewsAndHighLights.value.length; i++) {
          let slideNewsAndHighLightItem = slideNewsAndHighLights.value[i];
          let slidecaptionTrimmer = this.wordTrimmer(slideNewsAndHighLightItem.SlideCaption, 180);
          let slideNewsAndHighlightItemHtml = `
              <div class="${styles.catDsgSpWp1003NewsAndHighlightsLargePictureContainer}" id="${this.context.instanceId}_largePicture_container">
                <div class="${styles.catDsgSpWp1003NewsAndHighlightsLargePictureImageContainer}" id="${this.context.instanceId}_largePicture_pictureContainer">
                  <a class="${styles.catDsgSpWp1003NewsAndHighlightsPictureImgLink}" href="${slideNewsAndHighLightItem.SlideImageUrl.Url}" title="${slideNewsAndHighLightItem.Title}" id="${this.context.instanceId}_largePicture_pictureLink">
                    <img class="${styles.catDsgSpWp1003NewsAndHighlightsLargePictureImg}" id="${this.context.instanceId}_largePicture_picture"  alt="${slideNewsAndHighLightItem.Title}" src="${slideNewsAndHighLightItem.SlideImageUrl.Url}?width=918&amp;height=518">
                  </a>
                </div>
                <div class="${styles.catDsgSpWp1003NewsAndHighlightsLargePictureDataOverlay}"  id="${this.context.instanceId}_largePicture_dataContainerOverlay"></div>
                <div class="${styles.catDsgSpWp1003NewsAndHighlightsLargePictureDataContainer}" id="${this.context.instanceId}_largePicture_dataContainer">
                  <div class="fuse_data">
                    <a class="${styles.catDsgSpWp1003NewsAndHighlightsLargePictureLine1Link}" href="${slideNewsAndHighLightItem.SlideUrl}" title="${slideNewsAndHighLightItem.Title}" id="${this.context.instanceId}_largePicture_line1Link">
                      <h2 class="${styles.catDsgSpWp1003NewsAndHighlightsLargePictureLine1}" id="${this.context.instanceId}_largePicture_line1">${slideNewsAndHighLightItem.Title}</h2>
                    </a>
                    <div class="${styles.catDsgSpWp1003NewsAndHighlightsLargePictureLine2}" title="${slideNewsAndHighLightItem.SlideCaption}" id="${this.context.instanceId}_largePicture_line2"> ${slidecaptionTrimmer} </div>
                  </div>
                </div>
              </div>
              `;
          let slideNewsAndHignlightsPagingBarItemHtml = `             
                <a class="${styles.catDsgSpWp1003NewsAndHighlightsSlideshowPagingLinkInactive}" data-index="${i}" href="javascript:{}"  id="${this.context.instanceId}_slideShow_pagingControl${i}">
                  <span>&nbsp;</span>
                </a>`;
          dynamicNewsAndHighlightsHtml += slideNewsAndHighlightItemHtml;
          dynamicNewsAndHighlightsPagingBarHrml += slideNewsAndHignlightsPagingBarItemHtml;
        }
        this.domElement.querySelector("." + styles.catDsgSpWp1003NewsAndHighlightsSlideShowItems).innerHTML = dynamicNewsAndHighlightsHtml;
        this.domElement.querySelector("." + styles.catDsgSpWp1003NewsAndHighlightsSlideshowPagingBar).innerHTML = dynamicNewsAndHighlightsPagingBarHrml;
        $(this.domElement).find('.' + styles.catDsgSpWp1003NewsAndHighlightsSlideshowPagingBar + '>a').each((index, ele) => {
          ele.addEventListener('click', function () {
            var slideIndex = ele.getAttribute("data-index");
            SlideShow.handleSlideButtonOnClickEvent(this, slideIndex);
          });
        });

        var slideshows = $(this.domElement).find("." + styles.catDsgSpWp1003NewsAndHighlightsSlideshow);
        SlideShow.slideCount = slideNewsAndHighLights.value.length;
        SlideShow.activeSlideButtonClassName = styles.catDsgSpWp1003NewsAndHighlightsSlideshowPagingLinkActive;
        SlideShow.inactiveSlideButtonClassName = styles.catDsgSpWp1003NewsAndHighlightsSlideshowPagingLinkInactive;
        for (var j = 0; j < slideshows.length; j++) {
          SlideShow.initializeSlideShow(slideshows[j]);
        }
      } else {
        $(this.domElement).find("." + styles.catDsgSpWp1003NewsAndHighlightsSlideShowNoResults).show();
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
