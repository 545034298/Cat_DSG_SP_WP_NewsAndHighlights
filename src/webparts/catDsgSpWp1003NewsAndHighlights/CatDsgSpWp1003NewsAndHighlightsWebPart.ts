import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CatDsgSpWp1003NewsAndHighlightsWebPart.module.scss';
import * as strings from 'CatDsgSpWp1003NewsAndHighlightsWebPartStrings';

export interface ICatDsgSpWp1003NewsAndHighlightsWebPartProps {
  description: string;
}

export default class CatDsgSpWp1003NewsAndHighlightsWebPart extends BaseClientSideWebPart<ICatDsgSpWp1003NewsAndHighlightsWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.catDsgSpWp1003NewsAndHighlights }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Welcome to SharePoint!</span>
              <p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
              <p class="${ styles.description }">${escape(this.properties.description)}</p>
              <a href="https://aka.ms/spfx" class="${ styles.button }">
                <span class="${ styles.label }">Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>`;
  }

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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
