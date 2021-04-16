import {TwingLoaderArray, TwingEnvironment, TwingFunction, TwingLexer} from 'twing';

async function render(template: string, context: any = {}): Promise<string> {
    const loader = new TwingLoaderArray({
        template
    });
    const twingEnv = new TwingEnvironment(loader);
    twingEnv.addFunction(
        new TwingFunction(
            'target',
            async (field, key, lang) => {
                console.log('targetFct called', field, key, lang);
                return `[targetFunction called field: ${field}, key: ${key}, lang: ${lang}]`;
            },
            [
                { name: 'field' },
                { name: 'key', defaultValue: undefined },
                { name: 'lang', defaultValue: undefined }
            ]
        )
    );
    twingEnv.getFunctions().delete('source');
    (twingEnv as any).extensionSet.initialized = false;
    twingEnv.addFunction(
        new TwingFunction(
            'source',
            async (field, key, lang) => {
                console.log('sourceFct called', field, key, lang);
                return `[sourceFunction called field: ${field}, key: ${key}, lang: ${lang}]`;
            },
            [
                { name: 'field' },
                { name: 'key', defaultValue: undefined },
                { name: 'lang', defaultValue: undefined }
            ]
        )
    );
    (twingEnv as any).extensionSet.initialized = true;
    const lexer = new TwingLexer(twingEnv, {
        variable_pair: ['{', '}']
    });
    twingEnv.setLexer(lexer);
    return await twingEnv.render('template', context);
}

async function main(): Promise<void> {
    console.log(
        await render(
            `This is a template target: {target("field")} | source: {source("field")}`
        )
    );

    console.log(
        await render(
            `This is a template target: {target("field", title)} | source: {source("field", title)}`
        )
    );

    console.log(
        await render(
            `This is a template target: {target("field", "title", "fra")} | source: {source("field", "title", "fra")}`
        )
    );

    console.log(
        await render(
            `This is a template target: {target("fie\\"ld", "title")}`
        )
    );
}

main().then(() => console.log('done'));
