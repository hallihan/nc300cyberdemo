<script>
    export let total
    export let votes
    export let state

    $: enabled = state == ""

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    const vote = () => { 
        enabled = false
        setTimeout(() => {
            enabled = true
        }, 1000);
        dispatch('vote');
    }
</script>

<button class="tile" disabled={!enabled} on:click={vote} style="position: relative; background: rgba(0, 255, 149, {(votes>0?(votes/total)*0.8:0).toPrecision(2)});">
    <div class="con">
        {#if state!=""}
            {#if state=="x"}
                <span class="material-icons-round icon x">close</span>
            {:else}
                <span class="material-icons-outlined icon o">circle</span>
            {/if}
        {:else}
            <p style="opacity: {Math.max(votes>0?votes/total*5:0, 0.1)}; font-size: {Math.min(Math.max(1, votes / total * 3), 3.5) + "em"}">
                {votes}
            </p>
        {/if}
    </div>
    
</button>

<style>
    .submit-button {

    }

    .icon {
        font-size: 8em;
    }

    .x {
        color: red;
    }

    .o {
        font-size: 6.5em;
        color: blue;
    }

    .tile:enabled {
        cursor: pointer;
    }

    .con {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tile {
        color: inherit;
        font-size: inherit;
        margin: 0;
        background: inherit;
        width: 33.3333333%;

        height: 0;
        padding-bottom: 32.3333333%;
        position: relative;
        
        border: 0.5px solid #3b4252;
        box-sizing: border-box;
        position: relative;
        transition: background 0.5s;
    }

    .tile:active {
		background: none;
	}

    .tile:after {
        content: "";
        background: #00ff95;
        display: block;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        opacity: 0;
        transition: all 0.5s
    }
    
    .tile:enabled:hover:before {
        content: "";
        position: absolute;
        left: 0; right: 0; bottom: 0; top: 0;
        width: 100%;
        height: 100%;
        background: rgba(255,255,255,0.05)
    }  

    .tile:active:enabled:after{
        left: 50%;
        right: 50%;
        top: 50%;
        bottom: 50%;
        opacity: 0.5;
        transition: 0s
    }
</style>