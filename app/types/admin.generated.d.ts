/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as AdminTypes from './admin.types';

export type GetDiscountAutomaticBuyXGetYNodeByIdQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetDiscountAutomaticBuyXGetYNodeByIdQuery = { discountNode?: AdminTypes.Maybe<(
    Pick<AdminTypes.DiscountNode, 'id'>
    & { discount: (
      { __typename: 'DiscountAutomaticApp' }
      & Pick<AdminTypes.DiscountAutomaticApp, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticBasic' }
      & Pick<AdminTypes.DiscountAutomaticBasic, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticBxgy' }
      & Pick<AdminTypes.DiscountAutomaticBxgy, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticFreeShipping' }
      & Pick<AdminTypes.DiscountAutomaticFreeShipping, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeApp' }
      & Pick<AdminTypes.DiscountCodeApp, 'title' | 'usageLimit' | 'appliesOncePerCustomer' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeBasic' }
      & Pick<AdminTypes.DiscountCodeBasic, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeBxgy' }
      & Pick<AdminTypes.DiscountCodeBxgy, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeFreeShipping' }
      & Pick<AdminTypes.DiscountCodeFreeShipping, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ), metafield?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>>, selectedCollections?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>> }
  )>, collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'title'> }> } };

export type UpdateCodeDiscountMutationVariables = AdminTypes.Exact<{
  discount: AdminTypes.DiscountCodeAppInput;
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type UpdateCodeDiscountMutation = { discountUpdate?: AdminTypes.Maybe<{ userErrors: Array<Pick<AdminTypes.DiscountUserError, 'code' | 'message' | 'field'>> }> };

export type UpdateAutomaticDiscountMutationVariables = AdminTypes.Exact<{
  discount: AdminTypes.DiscountAutomaticAppInput;
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type UpdateAutomaticDiscountMutation = { discountUpdate?: AdminTypes.Maybe<{ userErrors: Array<Pick<AdminTypes.DiscountUserError, 'code' | 'message' | 'field'>> }> };

export type GetCollectionsQueryVariables = AdminTypes.Exact<{ [key: string]: never; }>;


export type GetCollectionsQuery = { collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'title'> }> } };

export type CreateCodeDiscountMutationVariables = AdminTypes.Exact<{
  discount: AdminTypes.DiscountCodeAppInput;
}>;


export type CreateCodeDiscountMutation = { discountCreate?: AdminTypes.Maybe<{ userErrors: Array<Pick<AdminTypes.DiscountUserError, 'code' | 'message' | 'field'>> }> };

export type CreateAutomaticDiscountMutationVariables = AdminTypes.Exact<{
  discount: AdminTypes.DiscountAutomaticAppInput;
}>;


export type CreateAutomaticDiscountMutation = { discountCreate?: AdminTypes.Maybe<{ userErrors: Array<Pick<AdminTypes.DiscountUserError, 'code' | 'message' | 'field'>> }> };

export type GetDeliveryCustomizationHideQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetDeliveryCustomizationHideQuery = { deliveryCustomization?: AdminTypes.Maybe<(
    Pick<AdminTypes.DeliveryCustomization, 'id' | 'title' | 'enabled'>
    & { metafield?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>> }
  )> };

export type UpdateDeliveryCustomizationMutationVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
  input: AdminTypes.DeliveryCustomizationInput;
}>;


export type UpdateDeliveryCustomizationMutation = { deliveryCustomizationUpdate?: AdminTypes.Maybe<{ deliveryCustomization?: AdminTypes.Maybe<Pick<AdminTypes.DeliveryCustomization, 'id'>>, userErrors: Array<Pick<AdminTypes.DeliveryCustomizationError, 'message'>> }> };

export type CreateDeliveryCustomizationMutationVariables = AdminTypes.Exact<{
  input: AdminTypes.DeliveryCustomizationInput;
}>;


export type CreateDeliveryCustomizationMutation = { deliveryCustomizationCreate?: AdminTypes.Maybe<{ deliveryCustomization?: AdminTypes.Maybe<Pick<AdminTypes.DeliveryCustomization, 'id'>>, userErrors: Array<Pick<AdminTypes.DeliveryCustomizationError, 'message'>> }> };

export type GetDeliveryCustomizationRenameQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetDeliveryCustomizationRenameQuery = { deliveryCustomization?: AdminTypes.Maybe<(
    Pick<AdminTypes.DeliveryCustomization, 'id' | 'title' | 'enabled'>
    & { metafield?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>> }
  )> };

export type GetDiscountAutomaticNodeByIdQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetDiscountAutomaticNodeByIdQuery = { discountNode?: AdminTypes.Maybe<(
    Pick<AdminTypes.DiscountNode, 'id'>
    & { discount: (
      { __typename: 'DiscountAutomaticApp' }
      & Pick<AdminTypes.DiscountAutomaticApp, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticBasic' }
      & Pick<AdminTypes.DiscountAutomaticBasic, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticBxgy' }
      & Pick<AdminTypes.DiscountAutomaticBxgy, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticFreeShipping' }
      & Pick<AdminTypes.DiscountAutomaticFreeShipping, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeApp' }
      & Pick<AdminTypes.DiscountCodeApp, 'title' | 'usageLimit' | 'appliesOncePerCustomer' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeBasic' }
      & Pick<AdminTypes.DiscountCodeBasic, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeBxgy' }
      & Pick<AdminTypes.DiscountCodeBxgy, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeFreeShipping' }
      & Pick<AdminTypes.DiscountCodeFreeShipping, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ), metafield?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>>, selectedCollections?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>> }
  )>, collections: { edges: Array<{ node: Pick<AdminTypes.Collection, 'id' | 'title'> }> } };

export type GetDiscountAutomaticNodeQueryVariables = AdminTypes.Exact<{
  id: AdminTypes.Scalars['ID']['input'];
}>;


export type GetDiscountAutomaticNodeQuery = { discountNode?: AdminTypes.Maybe<(
    Pick<AdminTypes.DiscountNode, 'id'>
    & { discount: (
      { __typename: 'DiscountAutomaticApp' }
      & Pick<AdminTypes.DiscountAutomaticApp, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticBasic' }
      & Pick<AdminTypes.DiscountAutomaticBasic, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticBxgy' }
      & Pick<AdminTypes.DiscountAutomaticBxgy, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountAutomaticFreeShipping' }
      & Pick<AdminTypes.DiscountAutomaticFreeShipping, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeApp' }
      & Pick<AdminTypes.DiscountCodeApp, 'title' | 'usageLimit' | 'appliesOncePerCustomer' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeBasic' }
      & Pick<AdminTypes.DiscountCodeBasic, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeBxgy' }
      & Pick<AdminTypes.DiscountCodeBxgy, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ) | (
      { __typename: 'DiscountCodeFreeShipping' }
      & Pick<AdminTypes.DiscountCodeFreeShipping, 'title' | 'startsAt' | 'endsAt' | 'status'>
      & { combinesWith: Pick<AdminTypes.DiscountCombinesWith, 'orderDiscounts' | 'productDiscounts' | 'shippingDiscounts'> }
    ), metafield?: AdminTypes.Maybe<Pick<AdminTypes.Metafield, 'id' | 'value'>> }
  )> };

export type CreateMetafieldDefinitionMutationVariables = AdminTypes.Exact<{
  definition: AdminTypes.MetafieldDefinitionInput;
}>;


export type CreateMetafieldDefinitionMutation = { metafieldDefinitionCreate?: AdminTypes.Maybe<{ createdDefinition?: AdminTypes.Maybe<Pick<AdminTypes.MetafieldDefinition, 'id' | 'name'>>, userErrors: Array<Pick<AdminTypes.MetafieldDefinitionCreateUserError, 'field' | 'message' | 'code'>> }> };

interface GeneratedQueryTypes {
  "#graphql\n        query getDiscountAutomaticBuyXGetYNodeByID($id: ID!) {\n          discountNode(id: $id) {\n            id\n            discount {\n              ... on DiscountCodeBasic {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeBxgy {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeFreeShipping {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticApp {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeApp {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                usageLimit\n                appliesOncePerCustomer\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticBasic {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticBxgy {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticFreeShipping {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n            }\n            metafield(namespace: \"$app:buy-x-get-y-product-discount\", key: \"function-configuration\") {\n              id\n              value\n            }\n            selectedCollections: metafield(namespace: \"$app:product-discount\", key: \"selected-collections\") {\n              id\n              value\n            }\n          }\n          collections(first: 250) {\n            edges {\n              node {\n                id\n                title\n              }\n            }\n          }\n        }": {return: GetDiscountAutomaticBuyXGetYNodeByIDQuery, variables: GetDiscountAutomaticBuyXGetYNodeByIDQueryVariables},
  "#graphql\n      query GetCollections {\n        collections(first: 250) {\n          edges {\n            node {\n              id\n              title\n            }\n          }\n        }\n      }": {return: GetCollectionsQuery, variables: GetCollectionsQueryVariables},
  "#graphql\n        query getDeliveryCustomizationHide($id: ID!) {\n          deliveryCustomization(id: $id) {\n            id\n            title\n            enabled\n            metafield(namespace: \"$app:delivery-option-hide\", key: \"function-configuration\") {\n              id\n              value\n            }\n          }\n        }": {return: GetDeliveryCustomizationHideQuery, variables: GetDeliveryCustomizationHideQueryVariables},
  "#graphql\n        query getDeliveryCustomizationRename($id: ID!) {\n          deliveryCustomization(id: $id) {\n            id\n            title\n            enabled\n            metafield(namespace: \"$app:delivery-option-rename\", key: \"function-configuration\") {\n              id\n              value\n            }\n          }\n        }": {return: GetDeliveryCustomizationRenameQuery, variables: GetDeliveryCustomizationRenameQueryVariables},
  "#graphql\n        query getDiscountAutomaticNodeByID($id: ID!) {\n          discountNode(id: $id) {\n            id\n            discount {\n              ... on DiscountCodeBasic {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeBxgy {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeFreeShipping {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticApp {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeApp {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                usageLimit\n                appliesOncePerCustomer\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticBasic {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticBxgy {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticFreeShipping {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n            }\n            metafield(namespace: \"$app:product-discount\", key: \"function-configuration\") {\n              id\n              value\n            }\n            selectedCollections: metafield(namespace: \"$app:product-discount\", key: \"selected-collections\") {\n              id\n              value\n            }\n          }\n          collections(first: 250) {\n            edges {\n              node {\n                id\n                title\n              }\n            }\n          }\n        }": {return: GetDiscountAutomaticNodeByIDQuery, variables: GetDiscountAutomaticNodeByIDQueryVariables},
  "#graphql\n        query getDiscountAutomaticNode($id: ID!) {\n          discountNode(id: $id) {\n            id\n            discount {\n              ... on DiscountCodeBasic {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeBxgy {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeFreeShipping {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticApp {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountCodeApp {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                usageLimit\n                appliesOncePerCustomer\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticBasic {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticBxgy {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n              ... on DiscountAutomaticFreeShipping {\n                __typename\n                title\n                combinesWith {\n                  orderDiscounts\n                  productDiscounts\n                  shippingDiscounts\n                }\n                startsAt\n                endsAt\n                status\n              }\n            }\n            metafield(namespace: \"$app:shipping-discount\", key: \"function-configuration\") {\n              id\n              value\n            }\n          }\n        }": {return: GetDiscountAutomaticNodeQuery, variables: GetDiscountAutomaticNodeQueryVariables},
}

interface GeneratedMutationTypes {
  "#graphql\n          mutation UpdateCodeDiscount($discount: DiscountCodeAppInput!, $id: ID!) {\n            discountUpdate: discountCodeAppUpdate(codeAppDiscount: $discount, id: $id) {\n              userErrors {\n                code\n                message\n                field\n              }\n            }\n          }": {return: UpdateCodeDiscountMutation, variables: UpdateCodeDiscountMutationVariables},
  "#graphql\n          mutation UpdateAutomaticDiscount($discount: DiscountAutomaticAppInput!, $id: ID!) {\n            discountUpdate: discountAutomaticAppUpdate(automaticAppDiscount: $discount, id: $id) {\n              userErrors {\n                code\n                message\n                field\n              }\n            }\n          }": {return: UpdateAutomaticDiscountMutation, variables: UpdateAutomaticDiscountMutationVariables},
  "#graphql\n          mutation CreateCodeDiscount($discount: DiscountCodeAppInput!) {\n            discountCreate: discountCodeAppCreate(codeAppDiscount: $discount) {\n              userErrors {\n                code\n                message\n                field\n              }\n            }\n          }": {return: CreateCodeDiscountMutation, variables: CreateCodeDiscountMutationVariables},
  "#graphql\n          mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {\n            discountCreate: discountAutomaticAppCreate(automaticAppDiscount: $discount) {\n              userErrors {\n                code\n                message\n                field\n              }\n            }\n          }": {return: CreateAutomaticDiscountMutation, variables: CreateAutomaticDiscountMutationVariables},
  "#graphql\n        mutation updateDeliveryCustomization($id: ID!, $input: DeliveryCustomizationInput!) {\n          deliveryCustomizationUpdate(id: $id, deliveryCustomization: $input) {\n            deliveryCustomization {\n              id\n            }\n            userErrors {\n              message\n            }\n          }\n        }": {return: UpdateDeliveryCustomizationMutation, variables: UpdateDeliveryCustomizationMutationVariables},
  "#graphql\n        mutation createDeliveryCustomization($input: DeliveryCustomizationInput!) {\n          deliveryCustomizationCreate(deliveryCustomization: $input) {\n            deliveryCustomization {\n              id\n            }\n            userErrors {\n              message\n            }\n          }\n        }": {return: CreateDeliveryCustomizationMutation, variables: CreateDeliveryCustomizationMutationVariables},
  "#graphql\n        mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {\n          metafieldDefinitionCreate(definition: $definition) {\n            createdDefinition {\n              id\n              name\n            }\n            userErrors {\n              field\n              message\n              code\n            }\n          }\n        }": {return: CreateMetafieldDefinitionMutation, variables: CreateMetafieldDefinitionMutationVariables},
}
declare module '@shopify/admin-api-client' {
  type InputMaybe<T> = AdminTypes.InputMaybe<T>;
  interface AdminQueries extends GeneratedQueryTypes {}
  interface AdminMutations extends GeneratedMutationTypes {}
}
