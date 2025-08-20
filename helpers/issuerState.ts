export const getIssuerStateName = (id: string, issuerStates: IssuerStateResponse[]) => {
  const issuerState = issuerStates.find(issuerState => issuerState.id === id);
  if (issuerState) {
    const name = issuerState?.name;
    return name ?? "";
  }
  return "";
};

export const filterIssuerStatesByParent = (parentId: string, issuerStates: IssuerStateResponse[]) => {
  if (!parentId) {
    return issuerStates;
  }
  return issuerStates?.filter(item => item.parentId === parentId);
}

export const transformIssuerState = (issuerStates: IssuerStateResponse[]) => {
  return issuerStates.map(({ id, name, parentId, stateCode }) => {
    const parentName = getIssuerStateName(parentId, issuerStates);
    const displayName: string = parentName ? parentName + ", " + name : name;
    return {
      id,
      name: `${displayName} ${stateCode ? '(' + stateCode + ')' : ''}`
    }
  });
};
