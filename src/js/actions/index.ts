export function render(payload: Jason.Actions.RenderPayload): Jason.Actions.Render{
    return {
        type: Jason.Actions.Types.RENDER,
        payload
    };
}


export function updateRender(payload: Jason.Actions.UpdateRenderPayload): Jason.Actions.UpdateRender{
    return {
        type: Jason.Actions.Types.UPDATE_RENDER,
        payload
    };
}